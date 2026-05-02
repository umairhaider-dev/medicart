"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield, Truck, Clock, Award, RefreshCw, Phone, Lock, Star,
  CheckCircle, BadgeCheck, Zap, Users
} from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "100% Genuine Products",
    desc: "Every product is sourced directly from certified manufacturers and verified for authenticity.",
    color: "#22c55e",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    glow: "shadow-green-100",
  },
  {
    icon: Truck,
    title: "Free & Fast Delivery",
    desc: "Free delivery on orders over $49. Express 2-hour delivery available in select cities.",
    color: "#0ea5e9",
    bg: "from-blue-50 to-sky-50",
    border: "border-blue-200",
    glow: "shadow-blue-100",
  },
  {
    icon: Clock,
    title: "24/7 Pharmacy Support",
    desc: "Our licensed pharmacists are available round the clock to answer your health queries.",
    color: "#8b5cf6",
    bg: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    glow: "shadow-violet-100",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    desc: "Recognized as Best Online Pharmacy 2024 by HealthCare Excellence Awards.",
    color: "#f59e0b",
    bg: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    glow: "shadow-amber-100",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns & Refunds",
    desc: "Hassle-free 30-day returns and quick refunds on all eligible products.",
    color: "#14b8a6",
    bg: "from-teal-50 to-cyan-50",
    border: "border-teal-200",
    glow: "shadow-teal-100",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "Bank-grade 256-bit SSL encryption. All major cards, UPI, and wallets accepted.",
    color: "#dc2626",
    bg: "from-red-50 to-rose-50",
    border: "border-red-200",
    glow: "shadow-red-100",
  },
];

const certifications = [
  { name: "FDA Approved", icon: "🏛️" },
  { name: "WHO GMP", icon: "🌍" },
  { name: "ISO 9001:2015", icon: "📋" },
  { name: "NABP Verified", icon: "✅" },
  { name: "HIPAA Compliant", icon: "🔒" },
  { name: "BBB Accredited", icon: "⭐" },
];

export default function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const certRef = useRef(null);
  const certInView = useInView(certRef, { once: true });

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #22c55e 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <BadgeCheck size={14} />
            Why Choose MediCart
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-heading">
            Your Health is in <span className="gradient-text">Safe Hands</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We go above and beyond to ensure every order reaches you safely, genuinely, and on time.
          </p>
        </motion.div>

        {/* Badge grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
              className="group"
            >
              <div className={`h-full bg-gradient-to-br ${badge.bg} border ${badge.border} rounded-3xl p-6 hover:shadow-xl ${badge.glow} transition-all duration-400 hover:-translate-y-2 relative overflow-hidden`}>
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(ellipse at top left, ${badge.color}10, transparent 70%)` }}
                />

                <div className="relative flex gap-4 items-start">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ background: `${badge.color}15` }}
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <badge.icon size={26} style={{ color: badge.color }} />
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-bold text-gray-900 text-base">{badge.title}</h3>
                      <CheckCircle size={14} style={{ color: badge.color }} className="flex-shrink-0" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{badge.desc}</p>
                  </div>
                </div>

                {/* Bottom decoration */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                  style={{ background: `linear-gradient(90deg, ${badge.color}, transparent)` }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "60%" } : {}}
                  transition={{ delay: i * 0.15 + 0.5, duration: 0.8 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Customer proof strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white mb-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Users, value: "2M+", label: "Happy Customers" },
              { icon: Star, value: "4.9/5", label: "Average Rating" },
              { icon: CheckCircle, value: "99.8%", label: "On-time Delivery" },
              { icon: Zap, value: "15min", label: "Avg Processing" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <stat.icon size={24} className="mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="text-green-100 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <div ref={certRef} className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={certInView ? { opacity: 1 } : {}}
            className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-widest"
          >
            Certified & Accredited By
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={certInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-full hover:border-green-300 hover:bg-green-50 transition-all duration-300 cursor-pointer group"
              >
                <span className="text-lg">{cert.icon}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-green-700 whitespace-nowrap">{cert.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
