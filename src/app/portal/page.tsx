"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Pill, LayoutDashboard, Package, ShoppingCart, FileText,
  Users, BarChart2, Shield, ChevronRight, Lock, Eye, EyeOff,
  ArrowLeft, Settings, Activity, Loader2
} from "lucide-react";

const portalSections = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Sales overview, KPIs, and real-time activity",
    color: "from-violet-500 to-purple-600",
    ring: "ring-violet-500/30",
    bg: "bg-violet-950/30",
  },
  {
    href: "/admin/products",
    icon: Package,
    label: "Products",
    description: "Manage inventory, pricing, and stock levels",
    color: "from-blue-500 to-cyan-600",
    ring: "ring-blue-500/30",
    bg: "bg-blue-950/30",
  },
  {
    href: "/admin/orders",
    icon: ShoppingCart,
    label: "Orders",
    description: "Process, track, and fulfill customer orders",
    color: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-950/30",
  },
  {
    href: "/admin/prescriptions",
    icon: FileText,
    label: "Prescriptions",
    description: "Review and approve uploaded prescriptions",
    color: "from-orange-500 to-amber-600",
    ring: "ring-orange-500/30",
    bg: "bg-orange-950/30",
    badge: "2 pending",
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "Users",
    description: "Customer accounts and access management",
    color: "from-rose-500 to-pink-600",
    ring: "ring-rose-500/30",
    bg: "bg-rose-950/30",
  },
  {
    href: "/admin/analytics",
    icon: BarChart2,
    label: "Analytics",
    description: "Revenue trends, conversion, and cohorts",
    color: "from-yellow-500 to-orange-500",
    ring: "ring-yellow-500/30",
    bg: "bg-yellow-950/30",
  },
  {
    href: "/admin/settings",
    icon: Settings,
    label: "Settings",
    description: "Site configuration, taxes, and integrations",
    color: "from-slate-500 to-gray-600",
    ring: "ring-slate-500/30",
    bg: "bg-slate-950/30",
  },
];

export default function StaffPortal() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@medicart.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      if (!data.user?.isAdmin) {
        setError("This account does not have admin access.");
        return;
      }
      setUnlocked(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal-900/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full bg-blue-900/10 blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors group">
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to MediCart
        </Link>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Activity size={12} className="text-green-500" />
          <span className="text-green-500">Systems operational</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 pt-16 pb-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-900/40">
            <Pill className="text-white" size={26} />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-green-400">Medi</span>
              <span className="text-white">Cart</span>
            </div>
            <div className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase -mt-0.5">Staff Portal</div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-sm mb-12"
        >
          Authorized personnel only
        </motion.p>

        {!unlocked ? (
          /* Login form */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center mb-4">
                  <Lock size={22} className="text-gray-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Admin Login</h2>
                <p className="text-xs text-gray-500 mt-1 text-center">Sign in with your admin credentials</p>
              </div>

              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Admin email"
                  className="w-full bg-gray-900/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Password"
                    className="w-full bg-gray-900/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-400 text-xs text-center mb-3"
                >
                  {error}
                </motion.p>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm hover:from-green-400 hover:to-teal-400 transition-all shadow-lg shadow-green-900/30 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in...</> : "Sign In"}
              </button>

              <p className="text-center text-[11px] text-gray-700 mt-4">
                Demo: admin@medicart.com / admin123
              </p>
            </div>
          </motion.div>
        ) : (
          /* Dashboard cards */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-0.5">Select a section to manage</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/30 border border-green-500/20 text-xs text-green-400">
                <Shield size={12} />
                Staff access granted
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {portalSections.map((section, i) => (
                <motion.div
                  key={section.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={section.href}
                    className={`group flex flex-col gap-4 p-5 rounded-2xl ${section.bg} border border-white/5 ring-1 ${section.ring} hover:border-white/10 hover:ring-2 transition-all duration-200 cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                        <section.icon size={20} className="text-white" />
                      </div>
                      {section.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm mb-1 flex items-center gap-1.5">
                        {section.label}
                        <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{section.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-bold hover:from-green-400 hover:to-teal-400 transition-all shadow-lg shadow-green-900/30"
              >
                <LayoutDashboard size={15} />
                Enter Full Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
