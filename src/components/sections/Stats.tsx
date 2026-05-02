"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Package, Users, Star, MapPin, Award, Clock } from "lucide-react";

interface StatItem {
  icon: typeof Package;
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  desc: string;
  color: string;
  bg: string;
}

const stats: StatItem[] = [
  { icon: Package, value: 50, suffix: "K+", label: "Products Available", desc: "Across all health categories", color: "#22c55e", bg: "from-green-500 to-emerald-600" },
  { icon: Users, value: 2, suffix: "M+", label: "Happy Customers", desc: "Trusted across 50+ cities", color: "#0ea5e9", bg: "from-blue-500 to-cyan-600" },
  { icon: Star, value: 4.9, suffix: "/5", label: "Customer Rating", desc: "Based on 500K+ reviews", color: "#f59e0b", bg: "from-amber-400 to-orange-500" },
  { icon: MapPin, value: 500, suffix: "+", label: "Cities Served", desc: "Pan-country delivery", color: "#8b5cf6", bg: "from-violet-500 to-purple-600" },
  { icon: Award, value: 15, suffix: "+", label: "Industry Awards", desc: "Best pharmacy platform", color: "#ec4899", bg: "from-pink-500 to-rose-600" },
  { icon: Clock, value: 99.8, suffix: "%", label: "On-time Delivery", desc: "We keep our promises", color: "#14b8a6", bg: "from-teal-500 to-cyan-600" },
];

function CountUp({ value, suffix, prefix, active }: { value: number; suffix: string; prefix?: string; active: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(value, current + increment);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, value]);

  const formatted = value % 1 === 0 ? Math.round(display) : display.toFixed(1);

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div ref={ref} className="px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 font-heading">
            Numbers that <span className="gradient-text">Speak Volumes</span>
          </h2>
          <p className="text-gray-400 text-lg">Trusted by millions. Backed by data.</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
              className="group relative"
            >
              <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-5 text-center hover:border-gray-600 hover:-translate-y-2 transition-all duration-400 hover:shadow-2xl overflow-hidden">
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${stat.bg}`} />

                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${stat.color}15, transparent 70%)` }}
                />

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <stat.icon size={22} className="text-white" />
                </motion.div>

                {/* Value */}
                <div className="text-2xl font-black text-white mb-1">
                  <CountUp value={stat.value} suffix={stat.suffix} prefix={stat.prefix} active={isInView} />
                </div>

                <div className="text-xs font-semibold text-gray-300 mb-1">{stat.label}</div>
                <div className="text-[10px] text-gray-500">{stat.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
