"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Star, TrendingUp, ArrowRight, ChevronLeft, ChevronRight, Zap, Eye, Shield } from "lucide-react";

const medicines = [
  {
    id: 1,
    name: "Vitamin D3 5000 IU",
    brand: "HealthCore",
    category: "Vitamins & Supplements",
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    rating: 4.9,
    reviews: 2847,
    stock: 15,
    image: "💊",
    color: "from-yellow-400 to-orange-400",
    bg: "from-yellow-50 to-orange-50",
    tags: ["Best Seller", "FDA Approved"],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Omega-3 Fish Oil 1000mg",
    brand: "NaturePlus",
    category: "Heart Health",
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    rating: 4.8,
    reviews: 1923,
    stock: 42,
    image: "🐟",
    color: "from-blue-400 to-cyan-400",
    bg: "from-blue-50 to-cyan-50",
    tags: ["Heart Health"],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 3,
    name: "Probiotic 50 Billion CFU",
    brand: "GutGuard",
    category: "Digestive Health",
    price: 39.99,
    originalPrice: 54.99,
    discount: 27,
    rating: 4.7,
    reviews: 3421,
    stock: 8,
    image: "🦠",
    color: "from-green-400 to-teal-400",
    bg: "from-green-50 to-teal-50",
    tags: ["Low Stock"],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Magnesium Glycinate 400mg",
    brand: "SleepWell",
    category: "Sleep & Relaxation",
    price: 28.99,
    originalPrice: 39.99,
    discount: 28,
    rating: 4.9,
    reviews: 1567,
    stock: 67,
    image: "🌙",
    color: "from-purple-400 to-violet-400",
    bg: "from-purple-50 to-violet-50",
    tags: ["New", "Top Rated"],
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 5,
    name: "Collagen Peptides Powder",
    brand: "GlowGenics",
    category: "Beauty & Skin",
    price: 44.99,
    originalPrice: 64.99,
    discount: 31,
    rating: 4.8,
    reviews: 4201,
    stock: 29,
    image: "✨",
    color: "from-pink-400 to-rose-400",
    bg: "from-pink-50 to-rose-50",
    tags: ["Best Seller", "Trending"],
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Ashwagandha KSM-66 600mg",
    brand: "StressLess",
    category: "Herbal & Organic",
    price: 32.99,
    originalPrice: 44.99,
    discount: 27,
    rating: 4.8,
    reviews: 2156,
    stock: 51,
    image: "🌿",
    color: "from-emerald-400 to-green-400",
    bg: "from-emerald-50 to-green-50",
    tags: ["Organic"],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 7,
    name: "Zinc + Vitamin C Immunity",
    brand: "ImmunoShield",
    category: "Immunity",
    price: 16.99,
    originalPrice: 24.99,
    discount: 32,
    rating: 4.7,
    reviews: 3890,
    stock: 120,
    image: "🛡️",
    color: "from-teal-400 to-cyan-400",
    bg: "from-teal-50 to-cyan-50",
    tags: ["Trending"],
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 8,
    name: "Biotin 10000mcg Hair & Nails",
    brand: "HairGrow",
    category: "Hair & Nails",
    price: 21.99,
    originalPrice: 29.99,
    discount: 27,
    rating: 4.6,
    reviews: 5234,
    stock: 84,
    image: "💅",
    color: "from-amber-400 to-yellow-400",
    bg: "from-amber-50 to-yellow-50",
    tags: ["New"],
    isNew: true,
    isBestSeller: false,
  },
];

const filters = ["All", "Best Sellers", "New Arrivals", "On Sale", "Trending", "Vitamins", "Herbal"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

function MedicineCard({ med, index }: { med: typeof medicines[0]; index: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quickView, setQuickView] = useState(false);

  const handleCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, type: "spring" }}
      className="group relative"
      onMouseEnter={() => setQuickView(true)}
      onMouseLeave={() => setQuickView(false)}
    >
      <div className={`relative bg-gradient-to-br ${med.bg} border border-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2`}>
        {/* Discount badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
            -{med.discount}%
          </div>
        </div>

        {/* Tags */}
        <div className="absolute top-3 right-12 z-10 flex flex-col gap-1">
          {med.isNew && (
            <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</span>
          )}
          {med.isBestSeller && (
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">BEST SELLER</span>
          )}
        </div>

        {/* Wishlist button */}
        <motion.button
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
          onClick={() => setWishlisted(!wishlisted)}
          whileTap={{ scale: 0.8 }}
        >
          <Heart
            size={15}
            className={wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"}
          />
        </motion.button>

        {/* Product image area */}
        <div className="relative h-44 flex items-center justify-center">
          <motion.div
            className="text-7xl select-none"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          >
            {med.image}
          </motion.div>

          {/* Glow circle behind image */}
          <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-br ${med.color} opacity-20 blur-xl`} />

          {/* Quick view overlay */}
          <AnimatePresence>
            {quickView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-green-50"
                  whileHover={{ scale: 1.1 }}
                >
                  <Eye size={15} className="text-green-600" />
                </motion.button>
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05 }}
                  className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-green-50"
                  whileHover={{ scale: 1.1 }}
                >
                  <Shield size={15} className="text-blue-600" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 bg-white rounded-t-3xl -mt-4 relative">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{med.category}</p>
            <h3 className="font-bold text-gray-900 text-sm leading-snug mt-0.5 line-clamp-2">{med.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">by {med.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={med.rating} />
            <span className="text-xs font-semibold text-gray-700">{med.rating}</span>
            <span className="text-xs text-gray-400">({med.reviews.toLocaleString()})</span>
          </div>

          {/* Stock indicator */}
          {med.stock < 20 && (
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${(med.stock / 100) * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              <span className="text-[10px] text-orange-500 font-semibold whitespace-nowrap">Only {med.stock} left!</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-900">${med.price}</span>
                <span className="text-sm text-gray-400 line-through">${med.originalPrice}</span>
              </div>
              <span className="text-xs text-green-600 font-semibold">Save ${(med.originalPrice - med.price).toFixed(2)}</span>
            </div>
          </div>

          {/* Add to cart */}
          <motion.button
            onClick={handleCart}
            className={`w-full py-2.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              addedToCart
                ? "bg-green-500 text-white"
                : `bg-gradient-to-r ${med.color} text-white hover:shadow-lg`
            }`}
            whileHover={{ scale: addedToCart ? 1 : 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  ✓ Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={15} /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrendingMedicines() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const itemsPerPage = 4;
  const totalPages = Math.ceil(medicines.length / itemsPerPage);
  const visible = medicines.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-green-100 to-teal-100 opacity-50 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-100 to-cyan-100 opacity-40 blur-3xl" />
      </div>

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 border border-orange-200">
              <TrendingUp size={14} />
              Trending Now
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 font-heading">
              Top Selling <span className="gradient-text">Products</span>
            </h2>
            <p className="text-gray-500 mt-2 text-lg">Hand-picked bestsellers loved by millions of customers</p>
          </motion.div>

          <motion.a
            href="#"
            className="hidden lg:flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all duration-300 group"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            View All Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {filters.map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === f
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* Flash deal banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-orange-200"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚡
            </motion.div>
            <div>
              <div className="text-white font-black text-xl">Flash Sale — Ends in</div>
              <div className="text-orange-100 text-sm">Limited stock available — grab before it's gone!</div>
            </div>
          </div>
          <FlashTimer />
          <motion.button
            className="bg-white text-orange-600 font-black px-6 py-2.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={16} className="inline mr-1.5" />
            Grab Deal
          </motion.button>
        </motion.div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visible.map((med, i) => (
              <MedicineCard key={med.id} med={med} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <motion.button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={18} />
          </motion.button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                page === i ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-green-300"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {i + 1}
            </motion.button>
          ))}
          <motion.button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function FlashTimer() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {[
        { val: time.h, label: "HRS" },
        { val: time.m, label: "MIN" },
        { val: time.s, label: "SEC" },
      ].map(({ val, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center min-w-[52px]">
            <div className="text-white font-black text-xl tabular-nums">{String(val).padStart(2, "0")}</div>
            <div className="text-orange-100 text-[9px] font-bold">{label}</div>
          </div>
          {i < 2 && <span className="text-white font-black text-xl">:</span>}
        </div>
      ))}
    </div>
  );
}
