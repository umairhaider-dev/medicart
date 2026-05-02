"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Star, Shield, Truck, Clock, Zap, Play,
  ChevronLeft, ChevronRight, Pill, Heart, Activity
} from "lucide-react";
import Button from "@/components/ui/Button";

const slides = [
  {
    badge: "New Arrivals",
    title: "Your Health,",
    titleAccent: "Our Priority",
    subtitle: "Get medicines, vitamins & health products delivered to your doorstep in under 2 hours. Trusted by 2 million+ customers.",
    cta: "Shop Now",
    ctaSecondary: "Upload Prescription",
    color: "from-green-500 to-teal-500",
    lightColor: "from-green-50 to-teal-50",
    accent: "#22c55e",
    image: "💊",
    stats: [{ label: "Products", value: "50K+" }, { label: "Brands", value: "500+" }, { label: "Customers", value: "2M+" }],
    floatingItems: [
      { icon: "🩺", label: "Doctor Verified", x: "right-8 top-20", delay: 0 },
      { icon: "🚚", label: "Free Delivery", x: "right-4 top-1/2", delay: 0.2 },
      { icon: "⭐", label: "4.9 Rated", x: "right-12 bottom-24", delay: 0.4 },
    ],
  },
  {
    badge: "Flash Sale — 40% OFF",
    title: "Healthcare at",
    titleAccent: "Best Prices",
    subtitle: "Exclusive deals on branded medicines, health supplements, and wellness products. Limited time offer!",
    cta: "Grab Deals",
    ctaSecondary: "View All Offers",
    color: "from-teal-500 to-cyan-500",
    lightColor: "from-teal-50 to-cyan-50",
    accent: "#14b8a6",
    image: "🏥",
    stats: [{ label: "Savings", value: "40%" }, { label: "Offers", value: "200+" }, { label: "Today", value: "Flash" }],
    floatingItems: [
      { icon: "💯", label: "100% Genuine", x: "right-8 top-20", delay: 0 },
      { icon: "🔒", label: "Secure Payment", x: "right-4 top-1/2", delay: 0.2 },
      { icon: "🎁", label: "Rewards", x: "right-12 bottom-24", delay: 0.4 },
    ],
  },
  {
    badge: "Prescription Made Easy",
    title: "Upload & Get",
    titleAccent: "Medicines Fast",
    subtitle: "Simply upload your doctor's prescription and we'll prepare your order with genuine medicines, verified by licensed pharmacists.",
    cta: "Upload Now",
    ctaSecondary: "Talk to Pharmacist",
    color: "from-cyan-500 to-blue-500",
    lightColor: "from-cyan-50 to-blue-50",
    accent: "#0ea5e9",
    image: "🧬",
    stats: [{ label: "Pharmacists", value: "500+" }, { label: "Verified", value: "100%" }, { label: "Processing", value: "15min" }],
    floatingItems: [
      { icon: "👨‍⚕️", label: "Expert Review", x: "right-8 top-20", delay: 0 },
      { icon: "✅", label: "Genuine Meds", x: "right-4 top-1/2", delay: 0.2 },
      { icon: "🏆", label: "Award Winning", x: "right-12 bottom-24", delay: 0.4 },
    ],
  },
];

const particleColors = ["#22c55e", "#14b8a6", "#0ea5e9", "#a855f7", "#f59e0b"];

function FloatingParticle({ x, y, color, size, delay }: { x: number; y: number; color: string; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0.15 }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.25, 0.1],
      }}
      transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    color: particleColors[i % particleColors.length],
    size: 8 + Math.random() * 20,
    delay: Math.random() * 3,
  }));

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(next, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlay, current]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/30 to-teal-50/20">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="blob absolute -top-32 -left-32 w-[500px] h-[500px] opacity-20"
          style={{ background: `radial-gradient(circle, ${slide.accent}40, transparent 70%)` }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="blob absolute -bottom-32 -right-32 w-[600px] h-[600px] opacity-15"
          style={{ background: `radial-gradient(circle, #14b8a640, transparent 70%)` }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5"
          style={{ background: `radial-gradient(circle, ${slide.accent}, transparent 60%)` }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero content */}
      <motion.div style={{ y, opacity }} className="flex-1 flex items-center">
        <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text content */}
            <div className="space-y-8 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-${current}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2"
                >
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${slide.color} text-white text-sm font-semibold shadow-lg`}>
                    <Zap size={14} className="animate-bounce-subtle" />
                    {slide.badge}
                  </span>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${current}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight font-heading">
                    <span className="text-gray-900">{slide.title}</span>
                    <br />
                    <span className="gradient-text">{slide.titleAccent}</span>
                  </h1>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${current}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg text-gray-600 leading-relaxed max-w-lg"
                >
                  {slide.subtitle}
                </motion.p>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`cta-${current}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button size="lg" className="shadow-xl shadow-green-300/40 hover:shadow-2xl hover:shadow-green-400/50 transition-shadow" icon={<ArrowRight size={20} />} iconPosition="right">
                    {slide.cta}
                  </Button>
                  <motion.button
                    className="flex items-center gap-3 px-6 py-4 rounded-full border-2 border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-600 font-semibold transition-all duration-300 hover:bg-green-50 group"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Play size={14} className="text-green-600 ml-0.5" fill="currentColor" />
                    </div>
                    {slide.ctaSecondary}
                  </motion.button>
                </motion.div>
              </AnimatePresence>

              {/* Stats row */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`stats-${current}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center gap-8 pt-4 border-t border-gray-100"
                >
                  {slide.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-black gradient-text">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {[
                  { icon: Shield, text: "FDA Approved" },
                  { icon: Truck, text: "Free Delivery" },
                  { icon: Clock, text: "2hr Express" },
                  { icon: Star, text: "4.9★ Rating" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <item.icon size={14} className="text-green-500" />
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Visual card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`visual-${current}`}
                initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateY: 15 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="relative hidden lg:block"
              >
                {/* Central card */}
                <div className={`relative w-full aspect-square max-w-lg mx-auto rounded-3xl bg-gradient-to-br ${slide.lightColor} border border-white shadow-2xl overflow-hidden`}>
                  {/* Inner decoration */}
                  <div className={`absolute inset-4 rounded-2xl bg-gradient-to-br ${slide.color} opacity-10`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-9xl select-none"
                      animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {slide.image}
                    </motion.div>
                  </div>

                  {/* Rotating ring */}
                  <motion.div
                    className="absolute inset-8 rounded-full border-4 border-dashed border-green-200 opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-16 rounded-full border-2 border-dashed border-teal-200 opacity-40"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Corner decorations */}
                  {[Pill, Heart, Activity].map((Icon, i) => {
                    const positions = ["top-4 left-4", "top-4 right-4", "bottom-4 left-4"];
                    return (
                      <motion.div
                        key={i}
                        className={`absolute ${positions[i]} w-10 h-10 rounded-2xl bg-white shadow-lg flex items-center justify-center`}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      >
                        <Icon size={18} className="text-green-500" />
                      </motion.div>
                    );
                  })}

                  {/* Discount badge */}
                  <motion.div
                    className="absolute bottom-4 right-4 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-2xl px-4 py-2 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-xs font-medium opacity-80">Up to</div>
                    <div className="text-2xl font-black leading-none">40%</div>
                    <div className="text-xs font-medium opacity-80">OFF</div>
                  </motion.div>
                </div>

                {/* Floating info cards */}
                {slide.floatingItems.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${item.x} bg-white rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2.5 border border-gray-100`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                    transition={{
                      opacity: { delay: item.delay + 0.5 },
                      scale: { delay: item.delay + 0.5 },
                      y: { duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }
                    }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider controls */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <motion.button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-green-600 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setIsAutoPlay(false); }}
                  className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: i === current ? 32 : 8, background: i === current ? slide.accent : "#e5e7eb" }}
                >
                  {i === current && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>

            <motion.button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-green-600 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L48 69.3C96 58.7 192 37.3 288 32C384 26.7 480 37.3 576 48C672 58.7 768 69.3 864 64C960 58.7 1056 37.3 1152 32C1248 26.7 1344 37.3 1392 42.7L1440 48V80H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
