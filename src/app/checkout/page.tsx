"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, MapPin, CreditCard, CheckCircle,
  ChevronRight, ChevronLeft, Lock, Shield, Truck,
  Zap, Clock, Star, Tag, X, Plus, Minus, Trash2,
  Pill, Package, ArrowRight, Gift, Sparkles,
  AlertTriangle, Home, Building2, Phone, Mail,
  User, FileText
} from "lucide-react";
import { useCart } from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { cn } from "@/lib/utils";

/* ─── Types ────────────────────────────────── */
type Step = "review" | "shipping" | "payment" | "confirmation";

interface ShippingData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; address2: string; city: string; state: string;
  zip: string; country: string; saveAddress: boolean;
}

interface PaymentData {
  cardNumber: string; name: string; expiry: string; cvv: string; sameAsBilling: boolean;
}

type DeliveryKey = "standard" | "express" | "sameday";

/* ─── Constants ────────────────────────────── */
const STEPS: { key: Step; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "review",       label: "Review",       icon: ShoppingCart },
  { key: "shipping",     label: "Shipping",     icon: MapPin },
  { key: "payment",      label: "Payment",      icon: CreditCard },
  { key: "confirmation", label: "Confirm",      icon: CheckCircle },
];

const DELIVERY_OPTIONS: { key: DeliveryKey; label: string; sub: string; price: number; free_above?: number; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "standard", label: "Standard Delivery",  sub: "3–5 business days",     price: 4.99, free_above: 49, icon: Truck },
  { key: "express",  label: "Express Delivery",   sub: "1–2 business days",     price: 9.99,               icon: Zap   },
  { key: "sameday",  label: "Same Day Delivery",  sub: "Arrives in 2–4 hours",  price: 14.99,              icon: Clock },
];

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

/* ─── Card helpers ─────────────────────────── */
function detectCard(num: string): { type: string; color: string } {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n))      return { type: "VISA",       color: "from-blue-600 to-blue-800" };
  if (/^5[1-5]/.test(n)) return { type: "MASTERCARD", color: "from-red-600 to-orange-600" };
  if (/^3[47]/.test(n))  return { type: "AMEX",       color: "from-teal-600 to-teal-800" };
  if (/^6/.test(n))      return { type: "DISCOVER",   color: "from-orange-500 to-amber-600" };
  return { type: "", color: "from-gray-700 to-gray-900" };
}

const fmtCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExpiry = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };
const fmtCVV    = (v: string) => v.replace(/\D/g, "").slice(0, 4);
const genOrder  = () => `MC-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

/* ─── Field component ──────────────────────── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500 flex items-center gap-1">
            <AlertTriangle size={10} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const INPUT_CLS = "w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all";

/* ─── Progress stepper ─────────────────────── */
function Stepper({ step }: { step: Step }) {
  const idx = STEPS.findIndex(s => s.key === step);
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        const future  = i > idx;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-500",
                  done   && "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200",
                  active && "bg-white border-green-500 text-green-600 shadow-lg shadow-green-100",
                  future && "bg-gray-50 border-gray-200 text-gray-300"
                )}
              >
                {done ? <CheckCircle size={18} /> : <s.icon size={16} />}
              </motion.div>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider hidden sm:block", done ? "text-green-600" : active ? "text-green-600" : "text-gray-300")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("w-12 sm:w-20 h-0.5 mx-1 rounded-full transition-all duration-700", i < idx ? "bg-green-400" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Order sidebar ────────────────────────── */
function OrderSidebar({ delivery, step }: { delivery: DeliveryKey; step: Step }) {
  const { state, subtotal, savings, promoSaving, applyPromo, removePromo } = useCart();
  const promoCode = state.promoCode;
  const [code, setCode] = useState(promoCode ?? "");
  const [err, setErr]   = useState("");

  const opt = DELIVERY_OPTIONS.find(d => d.key === delivery)!;
  const deliveryFee = opt.free_above != null && subtotal >= opt.free_above ? 0 : opt.price;
  const tax  = (subtotal - promoSaving + deliveryFee) * 0.085;
  const total = subtotal - promoSaving + deliveryFee + tax;

  const tryPromo = () => {
    const result = applyPromo(code.trim().toUpperCase());
    if (!result.ok) setErr(result.message);
    else { setErr(""); setCode(""); }
  };

  const isConfirmation = step === "confirmation";

  return (
    <div className="space-y-4">
      {/* Items list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Order Summary</h3>
          <span className="text-xs text-gray-400">{state.items.length} item{state.items.length !== 1 && "s"}</span>
        </div>
        <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
          {state.items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 px-5 py-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.product.bgColor} flex items-center justify-center text-lg flex-shrink-0`}>{item.product.image}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{item.product.name}</p>
                <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-900 flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promo code */}
      {!isConfirmation && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          {promoCode ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-green-600" />
                <span className="text-sm font-bold text-green-600">{promoCode} applied</span>
              </div>
              <button onClick={removePromo} className="text-xs text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setErr(""); }}
                onKeyDown={e => e.key === "Enter" && tryPromo()}
                placeholder="Promo code"
                className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-100 focus:border-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition-all uppercase font-mono"
              />
              <button onClick={tryPromo} className="px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors flex-shrink-0">Apply</button>
            </div>
          )}
          {err && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertTriangle size={10} />{err}</p>}
        </div>
      )}

      {/* Price breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2.5">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-semibold">
            <span>Product savings</span><span>−${savings.toFixed(2)}</span>
          </div>
        )}
        {promoSaving > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-semibold">
            <span>Promo ({promoCode})</span><span>−${promoSaving.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery ({opt.label.split(" ")[0]})</span>
          <span>{deliveryFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (8.5%)</span><span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-100">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
        {(savings + promoSaving) > 0 && (
          <div className="text-xs text-center text-green-600 font-bold bg-green-50 rounded-xl py-1.5">
            🎉 You're saving ${(savings + promoSaving).toFixed(2)} on this order!
          </div>
        )}
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Lock,    label: "SSL Secured"   },
          { icon: Shield,  label: "HIPAA Safe"    },
          { icon: Package, label: "Free Returns"  },
        ].map(b => (
          <div key={b.label} className="flex flex-col items-center gap-1 p-2.5 bg-white rounded-xl border border-gray-100 text-center">
            <b.icon size={14} className="text-green-500" />
            <span className="text-[9px] font-semibold text-gray-500">{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Review ───────────────────────── */
function ReviewStep({ onNext }: { onNext: () => void }) {
  const { state, updateQty, removeItem } = useCart();
  const items = state.items;

  if (items.length === 0) return (
    <div className="text-center py-16">
      <ShoppingCart size={48} className="text-gray-200 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">Your cart is empty</p>
      <Link href="/products" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors">
        Browse Products <ArrowRight size={15} />
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-black text-gray-900">Review Your Order</h2>
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4"
            >
              <Link href={`/products/${item.product.id}`} className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.product.bgColor} flex items-center justify-center text-3xl flex-shrink-0 hover:scale-105 transition-transform`}>
                {item.product.image}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-snug">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.product.brand}</p>
                    {item.product.prescription && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                        <FileText size={9} /> Prescription required
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeItem(item.product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  {/* Qty stepper */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                    <button
                      onClick={() => item.quantity > 1 ? updateQty(item.product.id, item.quantity - 1) : removeItem(item.product.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-green-600 transition-all"
                    >
                      {item.quantity === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} />}
                    </button>
                    <span className="w-6 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-green-600 transition-all"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                    {item.quantity > 1 && <p className="text-[10px] text-gray-400">${item.product.price} each</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Prescription notice */}
      {items.some(i => i.product.prescription) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <FileText size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-800">Prescription required</p>
            <p className="text-xs text-blue-600 mt-0.5">Some items require a valid prescription. You can upload it on the next screen or during checkout.</p>
          </div>
        </motion.div>
      )}

      <motion.button
        onClick={onNext}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-base shadow-lg hover:shadow-green-300/50 hover:shadow-xl transition-all"
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
      >
        Continue to Shipping <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}

/* ─── Step 2: Shipping ─────────────────────── */
function ShippingStep({ data, onChange, delivery, onDelivery, onNext, onBack }: {
  data: ShippingData; onChange: (d: ShippingData) => void;
  delivery: DeliveryKey; onDelivery: (k: DeliveryKey) => void;
  onNext: () => void; onBack: () => void;
}) {
  const { user } = useAuth();
  const { subtotal } = useCart();
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const set = (k: keyof ShippingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...data, [k]: e.target.value });

  const validate = () => {
    const e: typeof errors = {};
    if (!data.firstName.trim())  e.firstName  = "Required";
    if (!data.lastName.trim())   e.lastName   = "Required";
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Valid email required";
    if (!data.phone.trim())      e.phone      = "Required";
    if (!data.address.trim())    e.address    = "Required";
    if (!data.city.trim())       e.city       = "Required";
    if (!data.state)             e.state      = "Required";
    if (!data.zip.trim() || !/^\d{5}(-\d{4})?$/.test(data.zip)) e.zip = "Enter a valid ZIP code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  // Pre-fill from saved address
  useEffect(() => {
    if (user?.addresses?.length && !data.address) {
      const def = user.addresses.find(a => a.isDefault) ?? user.addresses[0];
      onChange({
        ...data,
        firstName: user.name.split(" ")[0] ?? "",
        lastName:  user.name.split(" ").slice(1).join(" ") ?? "",
        email:     user.email,
        phone:     user.phone ?? "",
        address:   def.line1,
        address2:  def.line2 ?? "",
        city:      def.city,
        state:     def.state,
        zip:       def.zip,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-gray-900">Shipping Details</h2>

      {/* Saved address selector */}
      {user?.addresses?.length ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Addresses</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {user.addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => onChange({ ...data, address: addr.line1, address2: addr.line2 ?? "", city: addr.city, state: addr.state, zip: addr.zip })}
                className={cn(
                  "text-left p-3.5 rounded-xl border-2 transition-all",
                  data.address === addr.line1 ? "border-green-400 bg-green-50" : "border-gray-100 hover:border-gray-200 bg-white"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {addr.label === "Home" ? <Home size={12} className="text-green-600" /> : <Building2 size={12} className="text-blue-600" />}
                  <span className="text-xs font-bold text-gray-700">{addr.label}</span>
                  {addr.isDefault && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">Default</span>}
                </div>
                <p className="text-xs text-gray-500">{addr.line1}, {addr.city}, {addr.state} {addr.zip}</p>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or enter a new address</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        </div>
      ) : null}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" error={errors.firstName}>
            <input value={data.firstName} onChange={set("firstName")} placeholder="John" className={cn(INPUT_CLS, errors.firstName && "border-red-300")} />
          </Field>
          <Field label="Last Name" error={errors.lastName}>
            <input value={data.lastName} onChange={set("lastName")} placeholder="Smith" className={cn(INPUT_CLS, errors.lastName && "border-red-300")} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email Address" error={errors.email}>
            <input type="email" value={data.email} onChange={set("email")} placeholder="you@example.com" className={cn(INPUT_CLS, errors.email && "border-red-300")} />
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <input type="tel" value={data.phone} onChange={set("phone")} placeholder="+1 555-0100" className={cn(INPUT_CLS, errors.phone && "border-red-300")} />
          </Field>
        </div>
        <Field label="Street Address" error={errors.address}>
          <input value={data.address} onChange={set("address")} placeholder="742 Evergreen Terrace" className={cn(INPUT_CLS, errors.address && "border-red-300")} />
        </Field>
        <Field label="Apartment, suite, etc. (optional)">
          <input value={data.address2} onChange={set("address2")} placeholder="Apt 4B" className={INPUT_CLS} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Field label="City" error={errors.city}>
              <input value={data.city} onChange={set("city")} placeholder="Springfield" className={cn(INPUT_CLS, errors.city && "border-red-300")} />
            </Field>
          </div>
          <Field label="State" error={errors.state}>
            <select value={data.state} onChange={set("state")} className={cn(INPUT_CLS, errors.state && "border-red-300")}>
              <option value="">—</option>
              {US_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="ZIP Code" error={errors.zip}>
            <input value={data.zip} onChange={set("zip")} placeholder="62701" maxLength={10} className={cn(INPUT_CLS, errors.zip && "border-red-300")} />
          </Field>
          <Field label="Country">
            <select value={data.country} onChange={set("country")} className={INPUT_CLS}>
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </Field>
        </div>
        <label className="flex items-center gap-3 cursor-pointer pt-1">
          <input type="checkbox" checked={data.saveAddress} onChange={e => onChange({ ...data, saveAddress: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-400" />
          <span className="text-sm text-gray-600">Save address for future orders</span>
        </label>
      </div>

      {/* Delivery options */}
      <div>
        <h3 className="text-sm font-black text-gray-900 mb-3">Delivery Method</h3>
        <div className="space-y-2.5">
          {DELIVERY_OPTIONS.map((opt) => {
            const isFree = opt.free_above != null && subtotal >= opt.free_above;
            const selected = delivery === opt.key;
            return (
              <motion.button
                key={opt.key}
                onClick={() => onDelivery(opt.key)}
                whileTap={{ scale: 0.99 }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                  selected ? "border-green-400 bg-green-50 shadow-md shadow-green-100" : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all", selected ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500")}>
                  <opt.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900">{opt.label}</p>
                    {isFree && <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">FREE</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {isFree ? (
                    <div>
                      <span className="text-xs text-gray-400 line-through">${opt.price.toFixed(2)}</span>
                      <p className="text-sm font-black text-green-600">FREE</p>
                    </div>
                  ) : (
                    <p className="text-sm font-black text-gray-900">${opt.price.toFixed(2)}</p>
                  )}
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all", selected ? "border-green-500" : "border-gray-300")}>
                  {selected && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <motion.button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-base shadow-lg transition-all" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
          Continue to Payment <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Step 3: Payment ──────────────────────── */
function PaymentStep({ data, onChange, onNext, onBack }: {
  data: PaymentData; onChange: (d: PaymentData) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});
  const [flip, setFlip]     = useState(false);
  const card = detectCard(data.cardNumber);

  const set = (k: keyof PaymentData) => (v: string | boolean) =>
    onChange({ ...data, [k]: v });

  const validate = () => {
    const e: typeof errors = {};
    const digits = data.cardNumber.replace(/\s/g, "");
    if (digits.length < 13) e.cardNumber = "Enter a valid card number";
    if (!data.name.trim())  e.name = "Name is required";
    const [m, y] = data.expiry.split("/");
    if (!m || !y || parseInt(m) > 12 || parseInt(m) < 1 || parseInt("20" + y) < new Date().getFullYear()) e.expiry = "Invalid expiry date";
    if (data.cvv.length < 3) e.cvv = "Invalid CVV";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black text-gray-900">Payment</h2>

      {/* Card preview */}
      <div className="perspective-1000" style={{ perspective: 1000 }}>
        <motion.div
          animate={{ rotateY: flip ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-44 rounded-2xl"
        >
          {/* Front */}
          <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br p-5 flex flex-col justify-between shadow-xl text-white", card.color || "from-gray-700 to-gray-900")} style={{ backfaceVisibility: "hidden" }}>
            <div className="flex items-start justify-between">
              <div className="w-10 h-7 bg-yellow-400 rounded-md" />
              {card.type && <span className="text-sm font-black tracking-wider opacity-90">{card.type}</span>}
            </div>
            <div>
              <p className="font-mono text-xl tracking-widest mb-3">
                {(data.cardNumber || "•••• •••• •••• ••••").padEnd(19, "•").replace(/(.{4})/g, "$1 ").trim().slice(0, 19)}
              </p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase opacity-60 tracking-wider">Card Holder</p>
                  <p className="font-bold text-sm">{data.name || "YOUR NAME"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase opacity-60 tracking-wider">Expires</p>
                  <p className="font-bold text-sm">{data.expiry || "MM/YY"}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Back */}
          <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br shadow-xl", card.color || "from-gray-700 to-gray-900")} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div className="w-full h-10 bg-black/40 mt-6" />
            <div className="mx-5 mt-4">
              <div className="flex items-center justify-end gap-2">
                <div className="flex-1 h-8 bg-white/20 rounded" />
                <div className="bg-white text-gray-900 font-mono font-black text-sm px-3 py-1 rounded">
                  {data.cvv || "•••"}
                </div>
              </div>
              <p className="text-white/60 text-[10px] mt-2 text-right">CVV</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <Field label="Card Number" error={errors.cardNumber}>
          <input
            value={data.cardNumber}
            onChange={e => set("cardNumber")(fmtCard(e.target.value))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className={cn(INPUT_CLS, "font-mono tracking-widest", errors.cardNumber && "border-red-300")}
          />
        </Field>
        <Field label="Name on Card" error={errors.name}>
          <input
            value={data.name}
            onChange={e => set("name")(e.target.value)}
            placeholder="John Smith"
            className={cn(INPUT_CLS, errors.name && "border-red-300")}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry (MM/YY)" error={errors.expiry}>
            <input
              value={data.expiry}
              onChange={e => set("expiry")(fmtExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className={cn(INPUT_CLS, "font-mono", errors.expiry && "border-red-300")}
            />
          </Field>
          <Field label="CVV" error={errors.cvv}>
            <input
              value={data.cvv}
              onChange={e => set("cvv")(fmtCVV(e.target.value))}
              onFocus={() => setFlip(true)}
              onBlur={() => setFlip(false)}
              placeholder="•••"
              maxLength={4}
              className={cn(INPUT_CLS, "font-mono tracking-widest", errors.cvv && "border-red-300")}
            />
          </Field>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={data.sameAsBilling} onChange={e => set("sameAsBilling")(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-500" />
          <span className="text-sm text-gray-600">Billing address same as shipping</span>
        </label>
      </div>

      {/* Alt payment methods */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or pay with</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Apple Pay",  bg: "bg-black",     text: "text-white",     icon: "🍎" },
            { label: "Google Pay", bg: "bg-white border border-gray-200", text: "text-gray-700", icon: "G" },
          ].map(m => (
            <button key={m.label} className={cn("flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80", m.bg, m.text)}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
        <Lock size={12} className="text-green-500" />
        <span>256-bit SSL encryption · PCI-DSS compliant · Your data is never stored</span>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <motion.button
          onClick={() => { if (validate()) onNext(); }}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-black text-base shadow-lg transition-all"
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        >
          <Lock size={16} /> Place Order Securely
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Confetti particle ─────────────────────── */
function Confetti() {
  const colors = ["#10b981","#14b8a6","#3b82f6","#f59e0b","#ec4899","#8b5cf6"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            rotate: Math.random() * 360,
          }}
          animate={{ y: "110vh", rotate: Math.random() * 720, opacity: [1, 1, 0] }}
          transition={{ duration: 2.5 + Math.random() * 2, delay: Math.random() * 1.5, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

/* ─── Step 4: Confirmation ──────────────────── */
function ConfirmationStep({ orderId, delivery, shipping }: { orderId: string; delivery: DeliveryKey; shipping: ShippingData }) {
  const { clearCart } = useCart();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    clearCart();
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opt = DELIVERY_OPTIONS.find(d => d.key === delivery)!;
  const etaMap: Record<DeliveryKey, string> = {
    standard: "May 5–7, 2025",
    express:  "May 3, 2025",
    sameday:  "Today by 6:00 PM",
  };

  return (
    <div className="text-center space-y-6">
      {showConfetti && <Confetti />}

      {/* Success animation */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="flex items-center justify-center">
        <div className="relative">
          <motion.div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: 2, duration: 0.5 }}>
            <CheckCircle size={56} className="text-green-500" />
          </motion.div>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed! 🎉</h2>
        <p className="text-gray-500">Thank you for your order. We'll get it ready for you right away.</p>
      </motion.div>

      {/* Order details card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
          <span className="text-sm text-gray-500">Order Number</span>
          <span className="font-mono font-black text-green-600 text-sm">{orderId}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Delivery to",   value: `${shipping.firstName} ${shipping.lastName}` },
            { label: "Address",       value: `${shipping.address}, ${shipping.city}, ${shipping.state}` },
            { label: "Method",        value: opt.label },
            { label: "Estimated ETA", value: etaMap[delivery] },
          ].map(r => (
            <div key={r.label}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{r.label}</p>
              <p className="font-semibold text-gray-800 text-xs">{r.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next steps */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="grid grid-cols-3 gap-3">
        {[
          { icon: Mail,    label: "Confirmation email sent" },
          { icon: Package, label: "Order being prepared"    },
          { icon: Truck,   label: `${opt.label} dispatched` },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <item.icon size={15} className="text-green-600" />
            </div>
            <p className="text-[10px] text-green-700 font-semibold text-center leading-snug">{item.label}</p>
          </div>
        ))}
      </motion.div>

      {/* MediCoins earned */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
        <Gift size={18} className="text-amber-500" />
        <p className="text-sm text-amber-700 font-semibold">You earned <span className="font-black">+120 MediCoins</span> on this order!</p>
      </motion.div>

      {/* Action buttons */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="flex gap-3">
        <button onClick={() => router.push("/profile")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-green-500 text-green-600 font-bold text-sm hover:bg-green-50 transition-colors">
          <Package size={16} /> Track Order
        </button>
        <motion.button onClick={() => router.push("/products")} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm shadow-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          Continue Shopping <ArrowRight size={15} />
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────── */
export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();

  const [step, setStep]       = useState<Step>("review");
  const [delivery, setDelivery] = useState<DeliveryKey>("standard");
  const [orderId, setOrderId] = useState("");

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", address2: "", city: "", state: "", zip: "", country: "United States", saveAddress: false,
  });

  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: "", name: "", expiry: "", cvv: "", sameAsBilling: true,
  });

  useEffect(() => {
    if (state.items.length === 0 && step !== "confirmation") {
      router.push("/products");
    }
  }, [state.items.length, step, router]);

  const goTo = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const placeOrder = useCallback(() => {
    const id = genOrder();
    setOrderId(id);
    goTo("confirmation");
  }, []);

  const stepIdx = STEPS.findIndex(s => s.key === step);

  return (
    <>
      {/* Minimal checkout header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="px-4 sm:px-8 lg:px-14 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md shadow-green-200">
              <Pill size={16} className="text-white" />
            </div>
            <span className="font-black text-gray-900">Medi<span className="gradient-text">Cart</span></span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Lock size={12} className="text-green-500" /> Secure Checkout
          </div>
          <Link href="/products" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <X size={16} /> Exit
          </Link>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50/50 py-8">
        <div className="px-4 sm:px-8 lg:px-14 xl:px-20">
          {/* Stepper */}
          <Stepper step={step} />

          {step === "confirmation" ? (
            /* Confirmation is full-width */
            <div className="max-w-lg mx-auto">
              <ConfirmationStep orderId={orderId} delivery={delivery} shipping={shipping} />
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6 items-start">
              {/* Main form — 3/5 */}
              <div className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.22 }}
                  >
                    {step === "review" && (
                      <ReviewStep onNext={() => goTo("shipping")} />
                    )}
                    {step === "shipping" && (
                      <ShippingStep
                        data={shipping} onChange={setShipping}
                        delivery={delivery} onDelivery={setDelivery}
                        onNext={() => goTo("payment")}
                        onBack={() => goTo("review")}
                      />
                    )}
                    {step === "payment" && (
                      <PaymentStep
                        data={payment} onChange={setPayment}
                        onNext={placeOrder}
                        onBack={() => goTo("shipping")}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sidebar — 2/5 */}
              <div className="lg:col-span-2 lg:sticky lg:top-24">
                <OrderSidebar delivery={delivery} step={step} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
