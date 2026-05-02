"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Pill, Stethoscope, Baby, Dumbbell, Leaf, Eye, Sparkles,
  Heart, Brain, Thermometer, Syringe, Activity, ArrowRight, Zap
} from "lucide-react";

const categories = [
  { name: "Medicines", icon: Pill, color: "#22c55e", bg: "from-green-50 to-emerald-100", border: "border-green-200", count: "15,000+", badge: null },
  { name: "Health Devices", icon: Stethoscope, color: "#0ea5e9", bg: "from-blue-50 to-sky-100", border: "border-blue-200", count: "2,500+", badge: "New" },
  { name: "Baby Care", icon: Baby, color: "#ec4899", bg: "from-pink-50 to-rose-100", border: "border-pink-200", count: "3,200+", badge: null },
  { name: "Fitness", icon: Dumbbell, color: "#f97316", bg: "from-orange-50 to-amber-100", border: "border-orange-200", count: "4,800+", badge: "Hot" },
  { name: "Herbal & Organic", icon: Leaf, color: "#16a34a", bg: "from-emerald-50 to-green-100", border: "border-emerald-200", count: "1,900+", badge: null },
  { name: "Eye Care", icon: Eye, color: "#7c3aed", bg: "from-violet-50 to-purple-100", border: "border-violet-200", count: "800+", badge: null },
  { name: "Beauty & Skin", icon: Sparkles, color: "#db2777", bg: "from-fuchsia-50 to-pink-100", border: "border-fuchsia-200", count: "6,500+", badge: "Sale" },
  { name: "Cardiology", icon: Heart, color: "#dc2626", bg: "from-red-50 to-rose-100", border: "border-red-200", count: "2,100+", badge: null },
  { name: "Neurology", icon: Brain, color: "#8b5cf6", bg: "from-purple-50 to-violet-100", border: "border-purple-200", count: "950+", badge: null },
  { name: "Fever & Pain", icon: Thermometer, color: "#ea580c", bg: "from-orange-50 to-red-100", border: "border-orange-200", count: "1,200+", badge: null },
  { name: "Vaccines", icon: Syringe, color: "#0891b2", bg: "from-cyan-50 to-teal-100", border: "border-cyan-200", count: "300+", badge: "Priority" },
  { name: "Diagnostics", icon: Activity, color: "#059669", bg: "from-teal-50 to-green-100", border: "border-teal-200", count: "450+", badge: null },
];

const badgeColors: Record<string, string> = {
  New: "bg-blue-500",
  Hot: "bg-orange-500",
  Sale: "bg-rose-500",
  Priority: "bg-teal-500",
};

function CategoryCard({ cat, index }: { cat: typeof categories[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.04 }}
      className="group relative cursor-pointer"
    >
      <div className={`relative bg-gradient-to-br ${cat.bg} border ${cat.border} rounded-3xl p-5 h-full flex flex-col items-center text-center gap-3 transition-all duration-400 hover:shadow-2xl overflow-hidden`}>
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 50%, ${cat.color}15, transparent 70%)` }}
        />

        {/* Badge */}
        {cat.badge && (
          <div className={`absolute top-3 right-3 ${badgeColors[cat.badge]} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider z-10`}>
            {cat.badge}
          </div>
        )}

        {/* Icon container */}
        <motion.div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl"
          style={{ background: `${cat.color}18` }}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{ background: `${cat.color}25` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <cat.icon size={28} style={{ color: cat.color }} className="relative z-10" />
        </motion.div>

        {/* Name */}
        <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-gray-900 transition-colors">
          {cat.name}
        </h3>

        {/* Product count */}
        <span className="text-xs text-gray-500 font-medium">{cat.count} products</span>

        {/* Arrow — appears on hover */}
        <motion.div
          className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: cat.color }}
        >
          Explore <ArrowRight size={12} />
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
          style={{ background: cat.color }}
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

export default function Categories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-green-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-green-200"
          >
            <Zap size={14} className="text-yellow-500" />
            Browse Categories
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-heading">
            Shop by <span className="gradient-text">Health Category</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Explore 50,000+ genuine products across all health & wellness categories, sourced directly from certified manufacturers.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-green-500 text-green-600 font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-200 group"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            View All Categories
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
