"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, Package, Users, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Truck, ArrowRight, Star, Eye
} from "lucide-react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

/* ── Mock data ── */
const REVENUE_DATA = [28400, 31200, 29800, 35600, 38100, 42300, 39800, 44100, 47200, 43800, 51200, 48900];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEKLY_DATA = [6200, 8100, 7400, 9300, 8700, 10200, 9800];
const WEEK_DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const RECENT_ORDERS = [
  { id: "ORD-2025-0481", customer: "Alex Johnson", email: "alex@email.com", items: 3, total: 54.97, status: "Delivered", date: "Apr 28" },
  { id: "ORD-2025-0392", customer: "Sarah Miller",  email: "sarah@email.com", items: 2, total: 68.98, status: "Shipped",   date: "Apr 27" },
  { id: "ORD-2025-0301", customer: "Raj Patel",     email: "raj@email.com",   items: 1, total: 30.98, status: "Processing",date: "Apr 26" },
  { id: "ORD-2025-0290", customer: "Emma Roberts",  email: "emma@email.com",  items: 4, total: 112.45,status: "Delivered", date: "Apr 25" },
  { id: "ORD-2025-0251", customer: "Chris Wong",    email: "chris@email.com", items: 2, total: 39.98, status: "Processing",date: "Apr 24" },
];

const STATUS_STYLE: Record<string, string> = {
  Delivered:  "bg-green-50 text-green-700 border-green-200",
  Shipped:    "bg-blue-50 text-blue-700 border-blue-200",
  Processing: "bg-orange-50 text-orange-700 border-orange-200",
  Cancelled:  "bg-red-50 text-red-700 border-red-200",
};

const TOP_PRODUCTS = PRODUCTS.slice(0, 5).map((p, i) => ({ ...p, sold: [412, 389, 301, 278, 241][i], revenue: [p.price * 412, p.price * 389, p.price * 301, p.price * 278, p.price * 241][i] }));

const LOW_STOCK = PRODUCTS.filter(p => p.stock < 20).slice(0, 5);

/* ── SVG Area Chart ── */
function AreaChart({ data, color = "#10b981", height = 120 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.9;
  const w = 100, h = height;
  const xs = data.map((_, i) => (i / (data.length - 1)) * w);
  const ys = data.map((v) => h - ((v - min) / (max - min)) * (h * 0.85) - h * 0.05);

  const linePath = data.map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <motion.path d={areaPath} fill={`url(#grad-${color.replace("#","")})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
      <motion.path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }} />
    </svg>
  );
}

/* ── Bar Chart ── */
function BarChart({ data, labels, color = "#10b981" }: { data: number[]; labels: string[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t-lg"
            style={{ backgroundColor: color, opacity: 0.8 + (v / max) * 0.2 }}
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 80}%` }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: "backOut" }}
          />
          <span className="text-[9px] text-gray-400 font-medium">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut Chart ── */
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let cumulative = 0;
  const r = 40, cx = 50, cy = 50;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0 -rotate-90">
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLen = pct * circumference;
          const offset = circumference - cumulative * circumference;
          cumulative += pct;
          return (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="18"
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r="28" fill="white" />
      </svg>
      <div className="space-y-1.5 flex-1">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-xs text-gray-600 font-medium">{seg.label}</span>
            </div>
            <span className="text-xs font-bold text-gray-800">{Math.round((seg.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, change, color, bg, sparkData }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: string; change: number; color: string; bg: string; sparkData: number[];
}) {
  const up = change >= 0;
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden relative">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
          <Icon size={18} className={color} />
        </div>
        <span className={cn("flex items-center gap-0.5 text-xs font-bold", up ? "text-green-600" : "text-red-500")}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(change)}%
        </span>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 opacity-30">
        <AreaChart data={sparkData} color={color.replace("text-", "#")} height={40} />
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [revenueRange, setRevenueRange] = useState<"weekly" | "monthly">("monthly");

  const totalRevenue = REVENUE_DATA.reduce((s, v) => s + v, 0);
  const totalOrders  = 1842;
  const totalUsers   = 2841;
  const totalProducts = PRODUCTS.length;

  const STATS = [
    { icon: DollarSign, label: "Total Revenue",  value: `$${(totalRevenue/1000).toFixed(1)}K`, change: 12.4, color: "text-green-600",  bg: "bg-green-50",  sparkData: REVENUE_DATA.slice(-7) },
    { icon: ShoppingBag,label: "Orders Today",   value: "142",      change: 8.1,  color: "text-blue-600",   bg: "bg-blue-50",   sparkData: WEEKLY_DATA },
    { icon: Package,    label: "Total Products", value: `${totalProducts}`,    change: 3.2,  color: "text-purple-600", bg: "bg-purple-50", sparkData: [28,30,28,29,30,30,30] },
    { icon: Users,      label: "Active Users",   value: totalUsers.toLocaleString(), change: -2.1, color: "text-orange-600", bg: "bg-orange-50", sparkData: [2400,2500,2450,2600,2700,2780,2841] },
  ];

  const CATEGORY_SEGMENTS = [
    { label: "Medicines",  value: 38, color: "#10b981" },
    { label: "Vitamins",   value: 22, color: "#3b82f6" },
    { label: "Devices",    value: 15, color: "#8b5cf6" },
    { label: "Fitness",    value: 12, color: "#f59e0b" },
    { label: "Others",     value: 13, color: "#ec4899" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, Admin — here's what's happening today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-700">Live data</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {revenueRange === "monthly" ? "Last 12 months" : "This week"} · <span className="text-green-600 font-semibold">↑ 12.4%</span>
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {(["weekly","monthly"] as const).map((r) => (
                <button key={r} onClick={() => setRevenueRange(r)}
                  className={cn("px-3 py-1 rounded-lg text-xs font-semibold transition-all", revenueRange === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
                >
                  {r === "weekly" ? "Week" : "Year"}
                </button>
              ))}
            </div>
          </div>

          {/* Y-axis labels + chart */}
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-[10px] text-gray-300 font-medium py-1 text-right" style={{ minWidth: 36 }}>
              {[60,45,30,15,0].map((v) => <span key={v}>${v}K</span>)}
            </div>
            <div className="flex-1">
              <AreaChart data={revenueRange === "monthly" ? REVENUE_DATA : WEEKLY_DATA} height={140} />
              <div className="flex justify-between mt-1">
                {(revenueRange === "monthly" ? MONTHS : WEEK_DAYS).map((m) => (
                  <span key={m} className="text-[9px] text-gray-300 font-medium">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category donut */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Sales by Category</h3>
          <p className="text-xs text-gray-400 mb-4">This month</p>
          <DonutChart segments={CATEGORY_SEGMENTS} />
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Total units sold</span>
              <span className="font-bold text-gray-900">4,821</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly bar chart + low stock */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Daily Orders</h3>
          <p className="text-xs text-gray-400 mb-4">This week</p>
          <BarChart data={WEEKLY_DATA.map(v => Math.round(v / 60))} labels={WEEK_DAYS} />
          <div className="mt-3 flex justify-between text-xs">
            <span className="text-gray-400">Avg / day</span>
            <span className="font-bold text-gray-800">{Math.round(WEEKLY_DATA.reduce((a,b)=>a+b,0) / 7 / 60)} orders</span>
          </div>
        </motion.div>

        {/* Low stock alerts */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900">Low Stock Alerts</h3>
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] font-black flex items-center justify-center">{LOW_STOCK.length}</span>
            </div>
            <Link href="/admin/products" className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {LOW_STOCK.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.bgColor} flex items-center justify-center text-lg flex-shrink-0`}>{p.image}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.brand}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={cn("text-sm font-black", p.stock < 10 ? "text-red-600" : "text-orange-600")}>{p.stock} left</p>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div className={cn("h-full rounded-full", p.stock < 10 ? "bg-red-500" : "bg-orange-400")} style={{ width: `${(p.stock / 50) * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent orders + top products */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Order","Customer","Items","Total","Status","Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-green-600 font-bold">{o.id.slice(-6)}</td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{o.customer}</p>
                        <p className="text-gray-400 text-[10px]">{o.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">{o.items}</td>
                    <td className="px-5 py-3 font-bold text-gray-900 text-xs">${o.total.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full border", STATUS_STYLE[o.status])}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{o.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Top Products</h3>
            <Link href="/admin/products" className="text-xs text-green-600 hover:text-green-700 font-semibold">All →</Link>
          </div>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className={cn("text-[10px] font-black w-5 text-center flex-shrink-0", i === 0 ? "text-yellow-500" : "text-gray-300")}>
                  {i === 0 ? "🥇" : `#${i+1}`}
                </span>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.bgColor} flex items-center justify-center text-base flex-shrink-0`}>{p.image}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.sold} sold</p>
                </div>
                <p className="text-xs font-bold text-gray-900 flex-shrink-0">${(p.revenue/1000).toFixed(1)}K</p>
              </div>
            ))}
          </div>

          {/* Rating summary */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <Star size={13} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-500">Avg product rating</span>
              <span className="ml-auto text-xs font-black text-gray-900">4.6 / 5</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/products", label: "Add Product",   icon: Package,    color: "from-green-500 to-teal-500"    },
          { href: "/admin/orders",   label: "Process Orders",icon: ShoppingBag,color: "from-blue-500 to-cyan-500"     },
          { href: "/admin/users",    label: "Manage Users",  icon: Users,      color: "from-purple-500 to-indigo-500" },
          { href: "/admin/analytics",label: "Analytics",     icon: TrendingUp, color: "from-orange-500 to-red-500"   },
        ].map((item, i) => (
          <motion.div key={item.href} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.07 }}>
            <Link href={item.href} className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br text-white font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all", item.color)}>
              <item.icon size={20} />
              {item.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
