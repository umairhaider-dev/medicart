"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  X, ShoppingCart, Trash2, Tag, ChevronRight, Truck, Shield,
  ArrowRight, Gift, Sparkles, CheckCircle, AlertCircle, Package
} from "lucide-react";
import { useCart } from "@/store/cartStore";
import CartItem from "./CartItem";
import { PRODUCTS } from "@/lib/products";

const RECOMMENDED = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

export default function CartDrawer() {
  const {
    state, closeDrawer, clearCart, applyPromo, removePromo,
    itemCount, subtotal, savings, deliveryFee, tax, promoSaving, total, isEmpty,
  } = useCart();

  const router = useRouter();
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const { addItem } = useCart();
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePromo = () => {
    if (!promoInput.trim()) return;
    const result = applyPromo(promoInput);
    setPromoMsg({ ok: result.ok, text: result.message });
    if (result.ok) setPromoInput("");
    setTimeout(() => setPromoMsg(null), 4000);
  };

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  const freeDeliveryLeft = Math.max(0, 49 - subtotal);
  const freeDeliveryPct  = Math.min(100, (subtotal / 49) * 100);

  return (
    <AnimatePresence>
      {state.drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[71] w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-teal-50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md">
                  <ShoppingCart size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-black text-gray-900 text-base">Your Cart</h2>
                  <p className="text-xs text-gray-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isEmpty && (
                  <motion.button
                    onClick={clearCart}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all font-semibold"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={12} /> Clear
                  </motion.button>
                )}
                <motion.button
                  onClick={closeDrawer}
                  className="p-2 rounded-xl hover:bg-white/80 text-gray-500 hover:text-gray-800 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* ── Free delivery progress ── */}
            {!isEmpty && (
              <div className="px-5 py-3 bg-white border-b border-gray-50 flex-shrink-0">
                {deliveryFee === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-green-600 text-sm font-semibold"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={14} />
                    </div>
                    🎉 You&apos;ve unlocked free delivery!
                  </motion.div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-gray-600 font-medium">
                        <Truck size={12} className="text-green-500" />
                        Add <span className="font-bold text-green-700">${freeDeliveryLeft.toFixed(2)}</span> for free delivery
                      </span>
                      <span className="text-gray-400">${subtotal.toFixed(2)} / $49</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-teal-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${freeDeliveryPct}%` }}
                        transition={{ duration: 0.6, type: "spring" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto">
              {isEmpty ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center px-6 text-center gap-4"
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-8xl"
                  >
                    🛒
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 mb-1">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Add medicines, vitamins, or health products to get started.
                    </p>
                  </div>
                  <motion.button
                    onClick={closeDrawer}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Start Shopping <ArrowRight size={16} />
                  </motion.button>

                  {/* Recommended */}
                  <div className="w-full mt-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-left">Popular picks</p>
                    <div className="space-y-2">
                      {RECOMMENDED.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-green-50 transition-colors">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.bgColor} flex items-center justify-center text-xl flex-shrink-0`}>
                            {p.image}
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                            <p className="text-xs text-green-600 font-semibold">${p.price}</p>
                          </div>
                          <motion.button
                            onClick={() => addItem(p)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${p.color} text-white flex-shrink-0`}
                            whileTap={{ scale: 0.9 }}
                          >
                            Add
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="p-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {state.items.map((item) => (
                      <CartItem key={item.product.id} item={item} />
                    ))}
                  </AnimatePresence>

                  {/* Recommended add-ons */}
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Sparkles size={11} className="text-yellow-500" /> You might also like
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                      {RECOMMENDED.filter((r) => !state.items.find((i) => i.product.id === r.id)).map((p) => (
                        <div key={p.id} className="flex-shrink-0 w-36 bg-gray-50 rounded-xl p-2.5 border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all">
                          <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${p.bgColor} flex items-center justify-center text-3xl mb-2`}>
                            {p.image}
                          </div>
                          <p className="text-[11px] font-bold text-gray-800 line-clamp-1 mb-0.5">{p.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-900">${p.price}</span>
                            <motion.button
                              onClick={() => addItem(p)}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${p.color} text-white`}
                              whileTap={{ scale: 0.9 }}
                            >
                              + Add
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer (checkout panel) ── */}
            {!isEmpty && (
              <div className="border-t border-gray-100 bg-white flex-shrink-0 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
                {/* Promo code */}
                <div className="px-5 pt-4 pb-3">
                  {state.promoCode ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="text-sm font-bold text-green-700">{state.promoCode}</span>
                        <span className="text-xs text-green-600">— {state.promoDiscount}% off applied</span>
                      </div>
                      <button onClick={removePromo} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={14} />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          ref={inputRef}
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                          placeholder="Promo code (e.g. SAVE10)"
                          className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-400 focus:bg-white transition-all font-medium uppercase placeholder:normal-case placeholder:font-normal"
                        />
                      </div>
                      <motion.button
                        onClick={handlePromo}
                        className="px-4 py-2.5 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors flex-shrink-0"
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                  )}
                  <AnimatePresence>
                    {promoMsg && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`text-xs font-semibold mt-1.5 flex items-center gap-1 ${promoMsg.ok ? "text-green-600" : "text-red-500"}`}
                      >
                        {promoMsg.ok ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                        {promoMsg.text}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price breakdown */}
                <div className="px-5 py-3 border-t border-gray-50 space-y-2">
                  <PriceLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                  {savings > 0 && <PriceLine label="Product Savings" value={`-$${savings.toFixed(2)}`} green />}
                  {promoSaving > 0 && <PriceLine label={`Promo (${state.promoCode})`} value={`-$${promoSaving.toFixed(2)}`} green />}
                  <PriceLine
                    label="Delivery"
                    value={deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                    green={deliveryFee === 0}
                    icon={<Truck size={11} />}
                  />
                  <PriceLine label="Tax (8.5%)" value={`$${tax.toFixed(2)}`} muted />
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-black text-gray-900 text-base">Total</span>
                    <span className="font-black text-gray-900 text-xl">${total.toFixed(2)}</span>
                  </div>
                  {savings + promoSaving > 0 && (
                    <p className="text-xs text-green-600 font-semibold text-right">
                      🎉 Total savings: ${(savings + promoSaving).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="px-5 pb-5 pt-2 space-y-2">
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 via-teal-500 to-green-500 bg-size-200 text-white font-black text-base hover:shadow-xl hover:shadow-green-200 transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Checkout <ChevronRight size={18} />
                  </motion.button>

                  <motion.button
                    onClick={closeDrawer}
                    className="w-full py-3 rounded-2xl border-2 border-gray-100 text-gray-600 font-semibold text-sm hover:border-green-300 hover:text-green-600 transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Shopping
                  </motion.button>

                  {/* Trust row */}
                  <div className="flex items-center justify-center gap-4 pt-1">
                    {[
                      { icon: Shield, text: "Secure" },
                      { icon: Package, text: "Genuine" },
                      { icon: Gift, text: "Easy Returns" },
                    ].map((t) => (
                      <div key={t.text} className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                        <t.icon size={11} className="text-green-500" />
                        {t.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function PriceLine({ label, value, green, muted, icon }: {
  label: string; value: string; green?: boolean; muted?: boolean; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`flex items-center gap-1 ${muted ? "text-gray-400" : "text-gray-600"}`}>
        {icon}{label}
      </span>
      <span className={`font-semibold ${green ? "text-green-600" : muted ? "text-gray-400" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  );
}
