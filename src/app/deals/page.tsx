"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Zap, Clock, Copy, CheckCircle, ShoppingCart, Heart, Star,
  TrendingUp, Package, Tag, ArrowRight, Flame, ChevronRight,
  Gift, Timer, Sparkles, AlertTriangle
} from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import { useWishlist } from "@/store/wishlistStore";
import { useToast } from "@/components/ui/Toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

/* ─── Countdown hook ─── */
function useCountdown(targetMs: number) {
  const [rem, setRem] = useState(Math.max(0, targetMs - Date.now()));

  useEffect(() => {
    const id = setInterval(() => setRem(r => Math.max(0, r - 1000)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const s = Math.floor(rem / 1000);
  return {
    h:  String(Math.floor(s / 3600)).padStart(2, "0"),
    m:  String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    s:  String(s % 60).padStart(2, "0"),
    expired: rem <= 0,
  };
}

function getEndOfDay()   { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); }
function getHoursFromNow(h: number) { return Date.now() + h * 3600 * 1000; }

/* ─── Digit flip cell ─── */
function ClockCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{   y:  24, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white tabular-nums shadow-lg"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{label}</span>
    </div>
  );
}

/* ─── Promo codes ─── */
const PROMOS = [
  { code: "SAVE10",   off: "10% OFF",  desc: "All orders",              color: "from-green-500 to-teal-500",    bg: "bg-green-50",  border: "border-green-200" },
  { code: "FIRST15",  off: "15% OFF",  desc: "First order",             color: "from-blue-500 to-cyan-500",     bg: "bg-blue-50",   border: "border-blue-200" },
  { code: "HEALTH20", off: "20% OFF",  desc: "Orders above $75",        color: "from-violet-500 to-purple-500", bg: "bg-violet-50", border: "border-violet-200" },
  { code: "MEDI30",   off: "30% OFF",  desc: "Weekend special",         color: "from-rose-500 to-pink-500",     bg: "bg-rose-50",   border: "border-rose-200" },
];

function PromoCard({ promo }: { promo: typeof PROMOS[0] }) {
  const [copied, setCopied] = useState(false);
  const { show } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(promo.code).catch(() => {});
    setCopied(true);
    show({ type: "success", title: `Code "${promo.code}" copied!`, desc: `${promo.off} · ${promo.desc}` });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn("rounded-2xl border-2 border-dashed p-5 flex flex-col gap-3 cursor-pointer transition-all", promo.bg, promo.border)}
      onClick={copy}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className={cn("text-lg font-black bg-gradient-to-r bg-clip-text text-transparent", promo.color)}>{promo.off}</span>
          <p className="text-xs text-gray-500 mt-0.5">{promo.desc}</p>
        </div>
        <motion.div whileTap={{ scale: 0.85 }} className={cn("p-2 rounded-xl bg-gradient-to-br text-white shadow-sm", promo.color)}>
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
        </motion.div>
      </div>
      <div className="flex items-center gap-2 font-mono bg-white/70 rounded-xl px-3 py-2 border border-white/80">
        <Tag size={12} className="text-gray-500" />
        <span className="text-sm font-black tracking-wider text-gray-800">{promo.code}</span>
        <span className="ml-auto text-[10px] font-bold text-gray-400">{copied ? "✓ Copied!" : "Click to copy"}</span>
      </div>
    </motion.div>
  );
}

/* ─── Deal card ─── */
function DealCard({
  product: p,
  endMs,
  extraDiscount = 0,
  featured = false,
}: {
  product: Product;
  endMs: number;
  extraDiscount?: number;
  featured?: boolean;
}) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { show } = useToast();
  const [cartState, setCartState] = useState<"idle" | "adding" | "added">("idle");
  const wishlisted = isWishlisted(p.id);
  const { h, m, s, expired } = useCountdown(endMs);

  const totalDiscount = Math.min(95, p.discount + extraDiscount);
  const dealPrice = +(p.originalPrice * (1 - totalDiscount / 100)).toFixed(2);
  const savingsAmt = (p.originalPrice - dealPrice).toFixed(2);

  const handleCart = async () => {
    setCartState("adding");
    await new Promise(r => setTimeout(r, 700));
    addItem(p);
    show({ type: "cart", title: "Added to cart!", desc: p.name });
    setCartState("added");
    setTimeout(() => setCartState("idle"), 2200);
  };

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${p.bgColor} border border-white/50 shadow-xl`}
      >
        {/* Glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-10`} />

        <div className="relative z-10 grid sm:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left */}
          <div className="flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full shadow">
                  <Flame size={12} /> DEAL OF THE DAY
                </span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-0.5 rounded-full">-{totalDiscount}% OFF</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">{p.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{p.brand} · {p.packSize}</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-2">{p.description}</p>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-black text-gray-900">${dealPrice}</span>
                <div className="mb-1">
                  <span className="text-lg text-gray-400 line-through block">${p.originalPrice}</span>
                  <span className="text-green-600 text-sm font-bold">Save ${savingsAmt}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleCart}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all",
                    cartState === "added" ? "bg-green-500 text-white" : `bg-gradient-to-r ${p.color} text-white hover:shadow-xl`
                  )}
                >
                  {cartState === "added" ? <><CheckCircle size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
                </motion.button>
                <motion.button
                  onClick={() => { const a = toggle(p); show({ type: "wishlist", title: a ? "Added to wishlist" : "Removed" }); }}
                  whileTap={{ scale: 0.85 }}
                  className={cn("p-3 rounded-2xl border-2 transition-all", wishlisted ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-white hover:border-rose-200")}
                >
                  <Heart size={18} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right — product image + countdown */}
          <div className="flex flex-col items-center justify-center gap-5">
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl sm:text-9xl select-none"
            >
              {p.image}
            </motion.div>

            {!expired && (
              <div className="text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                  <Timer size={12} className="text-red-500" /> Ends in
                </p>
                <div className="flex items-center gap-2">
                  <ClockCell value={h} label="Hrs" />
                  <span className="text-2xl font-black text-gray-400 mb-4">:</span>
                  <ClockCell value={m} label="Min" />
                  <span className="text-2xl font-black text-gray-400 mb-4">:</span>
                  <ClockCell value={s} label="Sec" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular deal card
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <Link href={`/products/${p.id}`}>
        <div className={`h-36 bg-gradient-to-br ${p.bgColor} flex items-center justify-center relative overflow-hidden`}>
          <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-br ${p.color} opacity-20 blur-xl`} />
          <motion.span className="text-6xl relative z-10" whileHover={{ scale: 1.1, y: -4 }} transition={{ type: "spring" }}>
            {p.image}
          </motion.span>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">-{totalDiscount}%</span>
            {extraDiscount > 0 && <span className="bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full">EXTRA</span>}
          </div>
          <motion.button
            onClick={e => { e.preventDefault(); const a = toggle(p); show({ type: "wishlist", title: a ? "Saved!" : "Removed" }); }}
            whileTap={{ scale: 0.8 }}
            className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart size={13} className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
          </motion.button>
        </div>
      </Link>

      <div className="p-3 space-y-2.5">
        <Link href={`/products/${p.id}`}>
          <p className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors">{p.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">{p.brand}</p>
        </Link>

        <div className="flex items-center gap-0.5">
          {[1,2,3,4,5].map(s2 => <Star key={s2} size={9} className={s2 <= Math.round(p.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />)}
          <span className="text-[10px] text-gray-400 ml-1">({p.rating})</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-lg font-black text-gray-900">${dealPrice}</span>
            <span className="text-xs text-gray-400 line-through ml-1.5">${p.originalPrice}</span>
          </div>
          <span className="text-[10px] text-green-600 font-bold">Save ${savingsAmt}</span>
        </div>

        {/* Mini countdown */}
        {!expired && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 rounded-lg px-2 py-1">
            <Timer size={10} /> {h}:{m}:{s} left
          </div>
        )}
        {expired && (
          <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
            <AlertTriangle size={10} /> Offer expired
          </div>
        )}

        <motion.button
          onClick={handleCart}
          disabled={expired || cartState === "adding"}
          whileHover={{ scale: !expired && cartState === "idle" ? 1.02 : 1 }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all",
            expired ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
            cartState === "added" ? "bg-green-500 text-white" : `bg-gradient-to-r ${p.color} text-white hover:shadow-md`
          )}
        >
          {cartState === "added" ? <><CheckCircle size={12} /> Added!</> : <><ShoppingCart size={12} /> Add to Cart</>}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Page ─── */
export default function DealsPage() {
  const endOfDay = getEndOfDay();

  // Sort products by discount descending, take top ones
  const sorted = [...PRODUCTS].sort((a, b) => b.discount - a.discount);
  const featured   = sorted[0];
  const flashDeals = sorted.slice(1, 13);
  const weeklyPicks = sorted.filter(p => p.isBestSeller).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Animated background elements */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 blur-3xl"
            style={{ width: 200 + i * 80, height: 200 + i * 80, left: `${i * 20 - 10}%`, top: `${(i % 3) * 30 - 20}%` }}
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}

        <div className="relative z-10 px-4 sm:px-6 lg:px-10 xl:px-14 py-14 sm:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-black px-4 py-1.5 rounded-full animate-pulse shadow-lg shadow-red-500/30">
                <Zap size={14} /> FLASH SALE LIVE
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black mb-3 leading-none">
              <span className="text-white">Today&apos;s</span>{" "}
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Hottest Deals</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Up to 60% off on top health products. Hurry — limited stock at these prices!
            </p>

            {/* Main countdown */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Sale ends in
              </p>
              <div className="flex items-center gap-3">
                <MainTimer endMs={endOfDay} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-10 space-y-14">

        {/* Featured deal */}
        {featured && (
          <section>
            <SectionHeader icon={<Flame size={18} className="text-red-500" />} title="Deal of the Day" subtitle="Best offer of the day — don't miss it!" />
            <DealCard product={featured} endMs={endOfDay} extraDiscount={10} featured />
          </section>
        )}

        {/* Flash deals grid */}
        <section>
          <SectionHeader icon={<Zap size={18} className="text-yellow-500" />} title="Flash Deals" subtitle="Limited time · Limited stock" cta={{ href: "/products", label: "View All" }} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {flashDeals.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <DealCard product={p} endMs={getHoursFromNow(2 + (i % 6))} extraDiscount={i % 3 === 0 ? 5 : 0} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Promo codes */}
        <section>
          <SectionHeader icon={<Tag size={18} className="text-violet-500" />} title="Coupon Codes" subtitle="Click any coupon to copy · Use at checkout" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROMOS.map(p => <PromoCard key={p.code} promo={p} />)}
          </div>
        </section>

        {/* Weekly picks */}
        {weeklyPicks.length > 0 && (
          <section>
            <SectionHeader icon={<TrendingUp size={18} className="text-teal-500" />} title="Weekly Best Sellers" subtitle="Consistent favourites at great prices" cta={{ href: "/products", label: "Shop More" }} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {weeklyPicks.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <DealCard product={p} endMs={getHoursFromNow(24 + i * 4)} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 p-8 sm:p-12 text-white text-center shadow-2xl shadow-green-200"
        >
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="absolute w-16 h-16 rounded-full bg-white" style={{ left: `${i * 10}%`, top: `${(i % 3) * 40}%`, opacity: 0.3 }} />
            ))}
          </div>
          <div className="relative z-10">
            <Sparkles size={32} className="mx-auto mb-3 text-yellow-300" />
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Never Miss a Deal Again</h2>
            <p className="text-green-100 mb-6 max-w-md mx-auto">Subscribe to flash sale alerts and save up to 60% on your favourite health products.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all text-sm backdrop-blur-sm"
              />
              <button className="px-6 py-3 rounded-2xl bg-white text-green-600 font-black text-sm hover:shadow-lg transition-all flex items-center gap-2">
                <Gift size={16} /> Notify Me
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

/* ─── Helpers ─── */
function MainTimer({ endMs }: { endMs: number }) {
  const { h, m, s } = useCountdown(endMs);
  return (
    <div className="flex items-center gap-2">
      <ClockCell value={h} label="Hrs" />
      <span className="text-3xl font-black text-gray-500 mb-4">:</span>
      <ClockCell value={m} label="Min" />
      <span className="text-3xl font-black text-gray-500 mb-4">:</span>
      <ClockCell value={s} label="Sec" />
    </div>
  );
}

function SectionHeader({
  icon, title, subtitle, cta,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          {icon}
          <h2 className="text-xl font-black text-gray-900">{title}</h2>
        </div>
        <p className="text-sm text-gray-500 ml-7">{subtitle}</p>
      </div>
      {cta && (
        <Link href={cta.href} className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex-shrink-0">
          {cta.label} <ChevronRight size={15} />
        </Link>
      )}
    </div>
  );
}
