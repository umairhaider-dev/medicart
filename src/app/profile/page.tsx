"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, MapPin, FileText, Settings, LogOut, Star,
  ChevronRight, Edit2, Plus, Trash2, CheckCircle, Clock,
  Truck, ShoppingBag, Heart, Bell, Shield, Coins,
  Camera, Phone, Mail, Award, TrendingUp, Gift
} from "lucide-react";
import { useAuth } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

/* ── Mock order data ── */
const ORDERS = [
  {
    id: "ORD-2025-0481",
    date: "April 28, 2025",
    items: [
      { name: "Paracetamol 500mg", qty: 2, price: 4.99, image: "💊" },
      { name: "Vitamin C 1000mg", qty: 1, price: 12.99, image: "🍊" },
    ],
    status: "Delivered",
    total: 22.97,
    deliveredOn: "April 30, 2025",
  },
  {
    id: "ORD-2025-0392",
    date: "April 15, 2025",
    items: [
      { name: "Omega-3 Fish Oil", qty: 1, price: 18.99, image: "🐟" },
      { name: "Blood Pressure Monitor", qty: 1, price: 49.99, image: "🩺" },
    ],
    status: "Shipped",
    total: 68.98,
    eta: "May 2, 2025",
  },
  {
    id: "ORD-2025-0301",
    date: "March 30, 2025",
    items: [
      { name: "Ashwagandha 500mg", qty: 2, price: 15.49, image: "🌿" },
    ],
    status: "Processing",
    total: 30.98,
  },
  {
    id: "ORD-2025-0211",
    date: "March 10, 2025",
    items: [
      { name: "Whey Protein Isolate", qty: 1, price: 54.99, image: "💪" },
      { name: "Vitamin D3 2000IU", qty: 1, price: 8.99, image: "☀️" },
    ],
    status: "Delivered",
    total: 63.98,
    deliveredOn: "March 13, 2025",
  },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  Delivered:  { color: "text-green-700",  bg: "bg-green-50 border-green-200",  icon: CheckCircle },
  Shipped:    { color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",    icon: Truck },
  Processing: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200",icon: Clock },
};

const TIER_CONFIG = {
  Silver:   { color: "from-gray-400 to-gray-300",   next: "Gold",     coinsNeeded: 2000, icon: "🥈" },
  Gold:     { color: "from-yellow-500 to-amber-400", next: "Platinum", coinsNeeded: 5000, icon: "🥇" },
  Platinum: { color: "from-purple-500 to-indigo-500",next: null,       coinsNeeded: null, icon: "💎" },
};

/* ── Sub-tabs ── */
type TabId = "overview" | "orders" | "addresses" | "prescriptions" | "settings";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: "overview",      label: "Overview",      icon: User },
  { id: "orders",        label: "My Orders",     icon: Package },
  { id: "addresses",     label: "Addresses",     icon: MapPin },
  { id: "prescriptions", label: "Prescriptions", icon: FileText },
  { id: "settings",      label: "Settings",      icon: Settings },
];

/* ── Overview tab ── */
function OverviewTab({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const tier = TIER_CONFIG[user.tier];
  const progress = user.tier === "Silver" ? (user.mediCoins / 2000) * 100 : user.tier === "Gold" ? (user.mediCoins / 5000) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Loyalty card */}
      <div className={`bg-gradient-to-br ${tier.color} rounded-3xl p-6 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Membership Tier</p>
            <p className="text-2xl font-black mt-0.5">{tier.icon} {user.tier} Member</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">MediCoins</p>
            <p className="text-3xl font-black">{user.mediCoins.toLocaleString()}</p>
          </div>
        </div>
        {tier.next && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/80">Progress to {tier.next}</span>
              <span className="font-bold">{user.mediCoins}/{tier.coinsNeeded}</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 1.2, delay: 0.3 }} />
            </div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: "Total Orders", value: ORDERS.length, color: "text-green-600", bg: "bg-green-50" },
          { icon: Heart,       label: "Wishlist",     value: 5,            color: "text-rose-600",  bg: "bg-rose-50"   },
          { icon: Gift,        label: "MediCoins",    value: user.mediCoins,color: "text-amber-600", bg: "bg-amber-50"  },
          { icon: Award,       label: "Member Since", value: user.memberSince.split(" ")[1], color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -2 }} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2", stat.bg)}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent orders preview */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="space-y-3">
          {ORDERS.slice(0, 2).map((order) => {
            const sc = STATUS_CONFIG[order.status];
            return (
              <div key={order.id} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-2xl">{order.items[0].image}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.date} · {order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">${order.total.toFixed(2)}</p>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", sc.bg, sc.color)}>{order.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Orders tab ── */
function OrdersTab() {
  return (
    <div className="space-y-4">
      {ORDERS.map((order, i) => {
        const sc = STATUS_CONFIG[order.status];
        const Icon = sc.icon;
        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Order header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div>
                <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              <span className={cn("flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border", sc.bg, sc.color)}>
                <Icon size={12} /> {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="px-5 py-4 space-y-3">
              {order.items.map((item, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50/60 border-t border-gray-50">
              <div>
                {order.status === "Delivered" && (
                  <p className="text-xs text-green-600 font-semibold">✓ Delivered on {order.deliveredOn}</p>
                )}
                {order.status === "Shipped" && (
                  <p className="text-xs text-blue-600 font-semibold">🚚 Expected by {order.eta}</p>
                )}
                {order.status === "Processing" && (
                  <p className="text-xs text-orange-600 font-semibold">⏳ Being prepared</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Order total</p>
                <p className="font-black text-gray-900">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Addresses tab ── */
function AddressesTab({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const [addresses, setAddresses] = useState(user.addresses);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{addresses.length} saved address{addresses.length !== 1 ? "es" : ""}</p>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700">
          <Plus size={15} /> Add new
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
          <MapPin size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No saved addresses</p>
          <p className="text-gray-400 text-sm">Add an address for faster checkout</p>
        </div>
      ) : (
        addresses.map((addr, i) => (
          <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{addr.line1}</p>
                  {addr.line2 && <p className="text-sm text-gray-500">{addr.line2}</p>}
                  <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => setAddresses(a => a.filter(x => x.id !== addr.id))} className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
            {!addr.isDefault && (
              <button onClick={() => setAddresses(a => a.map(x => ({ ...x, isDefault: x.id === addr.id })))} className="mt-3 text-xs text-green-600 hover:text-green-700 font-semibold">
                Set as default
              </button>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
}

/* ── Prescriptions tab ── */
function PrescriptionsTab() {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="space-y-5">
      {/* Upload box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        className={cn(
          "border-2 border-dashed rounded-3xl p-10 text-center transition-all",
          dragging ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
        )}
      >
        <FileText size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="font-bold text-gray-700 mb-1">Upload Prescription</p>
        <p className="text-sm text-gray-400 mb-4">Drag & drop or click to browse (JPG, PNG, PDF)</p>
        <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-bold">
          <Plus size={15} /> Choose File
          <input type="file" className="hidden" accept="image/*,.pdf" />
        </label>
      </div>

      {/* Saved prescriptions */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-sm">Saved Prescriptions</h3>
        {[
          { name: "Dr. Sharma's Prescription", date: "April 2025", status: "Verified", medicines: ["Metformin 500mg", "Amlodipine 5mg"] },
          { name: "General Checkup Rx", date: "February 2025", status: "Expired",  medicines: ["Amoxicillin 500mg"] },
        ].map((rx, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FileText size={22} className="text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-sm text-gray-900">{rx.name}</p>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", rx.status === "Verified" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                  {rx.status}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{rx.date}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {rx.medicines.map((m) => (
                  <span key={m} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Settings tab ── */
function SettingsTab({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const { updateUser, logout } = useAuth();
  const [name, setName]   = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    orders: true, offers: true, reminders: false, newsletter: true,
  });

  const save = () => {
    updateUser({ name, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Personal Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Full name", value: name, onChange: setName, icon: User },
            { label: "Phone", value: phone, onChange: setPhone, icon: Phone },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{f.label}</label>
              <div className="relative">
                <f.icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={f.value}
                  onChange={(e) => f.onChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={user.email} disabled className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 outline-none text-sm bg-gray-100 text-gray-400 cursor-not-allowed" />
            </div>
          </div>
        </div>
        <motion.button
          onClick={save}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-bold"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : "Save Changes"}
        </motion.button>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        {Object.entries(notifs).map(([key, val]) => {
          const labels: Record<string, string> = {
            orders: "Order updates & tracking",
            offers: "Exclusive offers & deals",
            reminders: "Medicine refill reminders",
            newsletter: "Health tips & newsletter",
          };
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700">{labels[key]}</span>
              </div>
              <button
                onClick={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                className={cn("w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0", val ? "bg-green-500" : "bg-gray-200")}
              >
                <motion.div animate={{ x: val ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h3 className="font-bold text-gray-900">Security</h3>
        {[
          { icon: Shield, label: "Change Password", sub: "Last changed 3 months ago" },
          { icon: Shield, label: "Two-Factor Authentication", sub: "Not enabled" },
        ].map((item) => (
          <button key={item.label} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left">
            <item.icon size={18} className="text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-red-50 border border-red-100 rounded-3xl p-5">
        <h3 className="font-bold text-red-700 mb-3">Danger Zone</h3>
        <button className="text-sm text-red-600 hover:text-red-700 font-semibold underline">Delete my account</button>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function ProfilePage() {
  const { user, isAuthenticated, openModal, logout } = useAuth();
  const [tab, setTab] = useState<TabId>("overview");
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      openModal("login");
    }
  }, [isAuthenticated, openModal]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <User size={36} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sign in required</h2>
          <p className="text-gray-500 text-center max-w-xs">Please sign in to view your profile, orders, and more.</p>
          <button
            onClick={() => openModal("login")}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Sign In
          </button>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← Back to Home</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          {/* Profile hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5"
          >
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                {user.name[0].toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                <Camera size={12} className="text-gray-500" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start flex-wrap">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-700 border border-amber-200">
                  {TIER_CONFIG[user.tier].icon} {user.tier} Member
                </span>
                <span className="text-xs text-gray-400">Member since {user.memberSince}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-100 text-gray-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all text-sm font-semibold"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-56 flex-shrink-0">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all w-full text-left flex-shrink-0",
                      tab === t.id
                        ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <t.icon size={16} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === "overview"      && <OverviewTab user={user} />}
                  {tab === "orders"        && <OrdersTab />}
                  {tab === "addresses"     && <AddressesTab user={user} />}
                  {tab === "prescriptions" && <PrescriptionsTab />}
                  {tab === "settings"      && <SettingsTab user={user} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
