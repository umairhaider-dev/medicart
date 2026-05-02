"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, CheckCircle, Clock, Truck,
  XCircle, Eye, X, Package, Phone, Mail, MapPin,
  ChevronLeft, ChevronRight, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface OrderItem { name: string; qty: number; price: number; image: string }
interface Order {
  id: string; customer: string; email: string; phone: string;
  address: string; date: string; items: OrderItem[];
  total: number; status: OrderStatus; payment: string; notes?: string;
}

const ORDERS: Order[] = [
  { id:"ORD-2025-0481", customer:"Alex Johnson",  email:"alex@email.com",  phone:"+1 555-0101", address:"742 Evergreen Terrace, Springfield IL 62701", date:"Apr 28, 2025", items:[{name:"Paracetamol 500mg",qty:2,price:4.99,image:"💊"},{name:"Vitamin C 1000mg",qty:1,price:12.99,image:"🍊"},{name:"Omega-3 Fish Oil",qty:1,price:18.99,image:"🐟"}], total:41.96, status:"Delivered", payment:"Credit Card", notes:"Leave at door" },
  { id:"ORD-2025-0480", customer:"Sarah Miller",  email:"sarah@email.com", phone:"+1 555-0202", address:"221B Baker Street, London, ON N6A 1B5",        date:"Apr 27, 2025", items:[{name:"Blood Pressure Monitor",qty:1,price:49.99,image:"🩺"},{name:"Vitamin D3 2000IU",qty:2,price:8.99,image:"☀️"}], total:67.97, status:"Shipped",   payment:"PayPal" },
  { id:"ORD-2025-0479", customer:"Raj Patel",     email:"raj@email.com",   phone:"+1 555-0303", address:"100 Main Street, Toronto ON M5V 3G2",           date:"Apr 26, 2025", items:[{name:"Ashwagandha 500mg",qty:2,price:15.49,image:"🌿"}], total:30.98, status:"Processing",payment:"Credit Card" },
  { id:"ORD-2025-0478", customer:"Emma Roberts",  email:"emma@email.com",  phone:"+1 555-0404", address:"456 Oak Avenue, Seattle WA 98101",              date:"Apr 25, 2025", items:[{name:"Whey Protein Isolate",qty:1,price:54.99,image:"💪"},{name:"Baby Multivitamin",qty:1,price:14.99,image:"🍼"},{name:"Neem Face Wash",qty:2,price:9.99,image:"🌿"},{name:"Glucosamine",qty:1,price:22.99,image:"🦴"}], total:112.95, status:"Delivered", payment:"Debit Card" },
  { id:"ORD-2025-0477", customer:"Chris Wong",    email:"chris@email.com", phone:"+1 555-0505", address:"789 Pine Road, Vancouver BC V5K 1A1",           date:"Apr 24, 2025", items:[{name:"Ibuprofen 400mg",qty:1,price:6.49,image:"💊"},{name:"Zinc Picolinate",qty:1,price:11.49,image:"🔷"}], total:17.98, status:"Processing",payment:"Credit Card" },
  { id:"ORD-2025-0476", customer:"Priya Sharma",  email:"priya@email.com", phone:"+1 555-0606", address:"303 Maple Lane, Calgary AB T2P 2G7",            date:"Apr 23, 2025", items:[{name:"Turmeric Curcumin",qty:3,price:16.99,image:"🌟"}], total:50.97, status:"Shipped",   payment:"PayPal" },
  { id:"ORD-2025-0475", customer:"James Brown",   email:"james@email.com", phone:"+1 555-0707", address:"55 King Street, Ottawa ON K1P 5M7",             date:"Apr 22, 2025", items:[{name:"Paracetamol 500mg",qty:1,price:4.99,image:"💊"}], total:4.99, status:"Cancelled",  payment:"Credit Card", notes:"Customer request" },
  { id:"ORD-2025-0474", customer:"Lily Chen",     email:"lily@email.com",  phone:"+1 555-0808", address:"99 River Drive, Montreal QC H2T 1E4",           date:"Apr 21, 2025", items:[{name:"Retinol Serum",qty:1,price:32.99,image:"✨"},{name:"Vitamin E Oil",qty:1,price:12.99,image:"💆"}], total:45.98, status:"Delivered", payment:"Credit Card" },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string; dot: string }> = {
  Processing: { label:"Processing", icon:Clock,       color:"text-orange-700", bg:"bg-orange-50 border-orange-200", dot:"bg-orange-400" },
  Shipped:    { label:"Shipped",    icon:Truck,       color:"text-blue-700",   bg:"bg-blue-50 border-blue-200",     dot:"bg-blue-400"   },
  Delivered:  { label:"Delivered",  icon:CheckCircle, color:"text-green-700",  bg:"bg-green-50 border-green-200",   dot:"bg-green-500"  },
  Cancelled:  { label:"Cancelled",  icon:XCircle,     color:"text-red-700",    bg:"bg-red-50 border-red-200",       dot:"bg-red-400"    },
};

const STATUS_FLOW: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

/* ── Order detail drawer ── */
function OrderDrawer({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: (id: string, s: OrderStatus) => void }) {
  const sc = STATUS_CONFIG[order.status];
  const Icon = sc.icon;
  const canProgress = order.status !== "Delivered" && order.status !== "Cancelled";
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(order.status as any) + 1];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-bold text-gray-900">{order.id}</p>
            <p className="text-xs text-gray-400">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Status + progress */}
          <div>
            <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border", sc.bg, sc.color)}>
              <Icon size={12} /> {order.status}
            </span>

            {order.status !== "Cancelled" && (
              <div className="flex items-center gap-1 mt-3">
                {STATUS_FLOW.map((s, i) => {
                  const idx = STATUS_FLOW.indexOf(order.status as any);
                  const done = i < idx;
                  const active = i === idx;
                  return (
                    <div key={s} className="flex items-center gap-1 flex-1">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all",
                        done ? "bg-green-500 text-white" : active ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"
                      )}>
                        {done ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[9px] font-bold truncate", active ? "text-blue-600" : done ? "text-green-600" : "text-gray-300")}>{s}</p>
                      </div>
                      {i < STATUS_FLOW.length - 1 && <div className={cn("w-4 h-0.5 flex-shrink-0", done ? "bg-green-300" : "bg-gray-100")} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</p>
            <p className="font-bold text-gray-900">{order.customer}</p>
            {[{ icon: Mail, val: order.email }, { icon: Phone, val: order.phone }, { icon: MapPin, val: order.address }].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <item.icon size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-600">{item.val}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</p>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty} × ${item.price}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">${(item.qty * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>${(order.total - 4.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span><span>{order.total > 49 ? <span className="text-green-600">Free</span> : "$4.99"}</span>
            </div>
            <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span><span>${order.total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">Payment: {order.payment}</p>
          </div>

          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-yellow-700">📝 Note: {order.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 space-y-2 sticky bottom-0 bg-white">
          {canProgress && nextStatus && (
            <motion.button
              onClick={() => onStatusChange(order.id, nextStatus)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              <Truck size={15} /> Mark as {nextStatus}
            </motion.button>
          )}
          {order.status === "Processing" && (
            <button onClick={() => onStatusChange(order.id, "Cancelled")} className="w-full py-2.5 rounded-xl border-2 border-red-100 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors">
              Cancel Order
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ── */
const PAGE_SIZE = 8;
const TABS: Array<{ key: "All" | OrderStatus; label: string; color: string }> = [
  { key:"All",        label:"All Orders", color:"text-gray-700"   },
  { key:"Processing", label:"Processing", color:"text-orange-600" },
  { key:"Shipped",    label:"Shipped",    color:"text-blue-600"   },
  { key:"Delivered",  label:"Delivered",  color:"text-green-600"  },
  { key:"Cancelled",  label:"Cancelled",  color:"text-red-500"    },
];

export default function AdminOrdersPage() {
  const [orders, setOrders]     = useState<Order[]>(ORDERS);
  const [tab, setTab]           = useState<"All" | OrderStatus>("All");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o));
    setSelected(o => o?.id === id ? { ...o, status } : o);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length };
    orders.forEach(o => { c[o.status] = (c[o.status] || 0) + 1; });
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    let res = orders;
    if (tab !== "All") res = res.filter(o => o.status === tab);
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
    }
    return res;
  }, [orders, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">{filtered.length} orders found</p>
        </div>
        {/* Summary pills */}
        <div className="hidden sm:flex gap-2">
          {(["Processing","Shipped"] as OrderStatus[]).map((s) => {
            const sc = STATUS_CONFIG[s];
            return counts[s] > 0 ? (
              <span key={s} className={cn("flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border", sc.bg, sc.color)}>
                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", sc.dot)} />
                {counts[s]} {s}
              </span>
            ) : null;
          })}
        </div>
      </div>

      {/* Tabs + search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Status tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-2" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0",
                tab === t.key ? t.color : "text-gray-400 hover:text-gray-600"
              )}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-full", tab === t.key ? "bg-current/10" : "bg-gray-100 text-gray-500")}>
                  {counts[t.key]}
                </span>
              )}
              {tab === t.key && <motion.div layoutId="order-tab-line" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-current" />}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by order ID, customer, email…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/70">
              <tr>
                {["Order ID","Customer","Items","Total","Status","Date","Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {paged.map((o, i) => {
                  const sc = STATUS_CONFIG[o.status];
                  const Icon = sc.icon;
                  return (
                    <motion.tr
                      key={o.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-green-600 font-bold">{o.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-800 text-xs">{o.customer}</p>
                        <p className="text-gray-400 text-[10px]">{o.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {o.items.slice(0, 3).map((it, j) => (
                            <span key={j} title={it.name} className="text-base">{it.image}</span>
                          ))}
                          {o.items.length > 3 && <span className="text-[10px] text-gray-400 font-bold">+{o.items.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900 text-sm">${o.total.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border", sc.bg, sc.color)}>
                          <Icon size={10} /> {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{o.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelected(o)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-700 text-xs font-semibold transition-colors">
                            <Eye size={12} /> View
                          </button>
                          {/* Quick status next-step button */}
                          {o.status === "Processing" && (
                            <button onClick={() => updateStatus(o.id, "Shipped")} className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors whitespace-nowrap">
                              → Ship
                            </button>
                          )}
                          {o.status === "Shipped" && (
                            <button onClick={() => updateStatus(o.id, "Delivered")} className="px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors whitespace-nowrap">
                              → Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Package size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No orders found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={cn("w-8 h-8 rounded-xl text-xs font-bold transition-all", page === n ? "bg-green-500 text-white" : "hover:bg-gray-100 text-gray-600")}
              >
                {n}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Order detail drawer */}
      <AnimatePresence>
        {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} />}
      </AnimatePresence>
    </div>
  );
}
