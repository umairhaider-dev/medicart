"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, AlertTriangle, CheckCircle, HelpCircle, BookOpen, ThumbsUp } from "lucide-react";
import type { Product } from "@/lib/products";

interface Props { product: Product }

const TABS = [
  { id: "overview",   label: "Overview",      icon: BookOpen },
  { id: "dosage",     label: "Dosage & Use",  icon: CheckCircle },
  { id: "sideeffects",label: "Side Effects",  icon: AlertTriangle },
  { id: "reviews",    label: "Reviews",       icon: Star },
  { id: "faq",        label: "FAQ",           icon: HelpCircle },
] as const;

type TabId = typeof TABS[number]["id"];

/* ── Dosage guide by category ── */
function getDosageGuide(p: Product) {
  const guides: Record<string, { frequency: string; duration: string; food: string; age: string; warning: string }> = {
    "Medicines":  { frequency: "As directed by physician (typically 3–4 times daily)", duration: "Complete prescribed course", food: "Can be taken with or without food", age: "Adult dosage; consult doctor for children", warning: "Do not exceed recommended dose. Seek medical advice if symptoms persist." },
    "Vitamins":   { frequency: "1 serving daily with water", duration: "Ongoing as required", food: "Best taken with a meal for optimal absorption", age: "Suitable for adults 18+", warning: "Keep out of reach of children. Store in a cool, dry place." },
    "Herbal":     { frequency: "2 capsules twice daily", duration: "Minimum 4–8 weeks for best results", food: "Take with a glass of water, preferably after meals", age: "Suitable for adults 18+", warning: "Consult healthcare provider if pregnant, nursing, or taking medications." },
    "Ayurvedic":  { frequency: "As directed on label (typically 1–2 times daily)", duration: "8–12 weeks for full benefit", food: "Take with warm water or milk", age: "Adults only unless specified", warning: "Authentic Ayurvedic formula. Discontinue if adverse reactions occur." },
    "Devices":    { frequency: "Use as per device instructions", duration: "N/A — ongoing monitoring", food: "N/A", age: "All ages (adult supervision for children)", warning: "Calibrate device regularly. Do not use if screen is damaged." },
    "Baby Care":  { frequency: "As directed by pediatrician", duration: "As needed", food: "Follow instructions on packaging", age: "Suitable for specified age group only", warning: "Consult pediatrician before use. Keep out of reach of children." },
    "Fitness":    { frequency: "1 serving post-workout or as directed", duration: "Ongoing as required", food: "Mix with water or milk", age: "Adults 18+. Not for use by minors.", warning: "Not a substitute for a balanced diet. Stay hydrated." },
    "Beauty":     { frequency: "Apply as directed, usually once or twice daily", duration: "4–12 weeks to see results", food: "Topical — not for ingestion", age: "Adults 18+", warning: "Patch test before first use. Avoid contact with eyes." },
  };
  return guides[p.category] ?? guides["Medicines"];
}

function Stars({ rating }: { rating: number }) {
  return <div className="flex">{[1,2,3,4,5].map((s) => <Star key={s} size={14} className={s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />)}</div>;
}

const MOCK_REVIEWS = [
  { name: "Sarah M.", rating: 5, date: "March 2025", text: "Excellent product — genuine, well-packaged, and arrived ahead of schedule. Will definitely reorder.", helpful: 34 },
  { name: "Dr. Raj P.", rating: 5, date: "February 2025", text: "I recommend this to my patients regularly. Quality is consistent with hospital-grade supplies.", helpful: 28 },
  { name: "Emma R.", rating: 4, date: "January 2025", text: "Very effective. Noticed results within the first week. Packaging could be slightly more secure.", helpful: 19 },
  { name: "Priya S.", rating: 5, date: "April 2025", text: "MediCart always delivers genuine products. This is my third reorder. Highly recommend!", helpful: 45 },
];

export default function ProductTabs({ product: p }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const dosage = getDosageGuide(p);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-100 px-2" style={{ scrollbarWidth: "none" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-4 text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTab === tab.id ? "text-green-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Overview ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">About this Product</h3>
                  <p className="text-gray-600 leading-relaxed">{p.description}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Primary Uses</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {p.uses.map((use) => (
                      <div key={use} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                        <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Form", value: p.form },
                    { label: "Strength", value: p.strength || "N/A" },
                    { label: "Pack Size", value: p.packSize },
                    { label: "Manufacturer", value: p.manufacturer },
                  ].map((spec) => (
                    <div key={spec.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                      <div className="text-xs text-gray-400 font-medium mb-0.5">{spec.label}</div>
                      <div className="text-sm font-bold text-gray-800">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Dosage ── */}
            {activeTab === "dosage" && (
              <div className="space-y-4">
                {[
                  { icon: "⏰", label: "Frequency", value: dosage.frequency },
                  { icon: "📅", label: "Duration", value: dosage.duration },
                  { icon: "🍽️", label: "With Food", value: dosage.food },
                  { icon: "👤", label: "Age Group", value: dosage.age },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="text-sm text-gray-700 font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 items-start bg-orange-50 border border-orange-200 rounded-2xl p-4">
                  <AlertTriangle size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-700 mb-1">Important Warning</p>
                    <p className="text-sm text-orange-600">{dosage.warning}</p>
                  </div>
                </div>
                {p.prescription && (
                  <div className="flex gap-3 items-start bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <CheckCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 font-medium">This is a prescription medicine. Use strictly as prescribed by your doctor.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Side Effects ── */}
            {activeTab === "sideeffects" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Side effects vary by individual. Most people tolerate this product well at recommended doses.</p>
                {p.sideEffects && p.sideEffects.length > 0 ? (
                  <div className="space-y-2">
                    {p.sideEffects.map((se) => (
                      <div key={se} className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                        <AlertTriangle size={13} className="text-yellow-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{se}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
                    <CheckCircle size={18} className="text-green-600" />
                    <p className="text-sm text-gray-700">Generally well tolerated. No major side effects reported at recommended doses.</p>
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <p className="text-xs text-blue-700 font-medium">⚠️ If you experience severe reactions, stop use immediately and consult a healthcare professional. This is not an exhaustive list.</p>
                </div>
              </div>
            )}

            {/* ── Reviews ── */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Summary bar */}
                <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-100">
                  <div className="text-center">
                    <div className="text-4xl font-black text-gray-900">{p.rating}</div>
                    <Stars rating={p.rating} />
                    <div className="text-xs text-gray-500 mt-1">{p.reviews.toLocaleString()} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5,4,3,2,1].map((s) => {
                      const pct = s === 5 ? 72 : s === 4 ? 18 : s === 3 ? 6 : s === 2 ? 2 : 2;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-4">{s}</span>
                          <Star size={11} className="text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.2 }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Review cards */}
                <div className="space-y-4">
                  {MOCK_REVIEWS.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.date}</p>
                          </div>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600 transition-colors">
                          <ThumbsUp size={12} /> Helpful ({r.helpful})
                        </button>
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">Verified Purchase</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQ ── */}
            {activeTab === "faq" && (
              <div className="space-y-3">
                {[
                  { q: "Is this product genuine?", a: "Yes. All products on MediCart are sourced directly from certified manufacturers and undergo rigorous quality checks by our in-house pharmacists." },
                  { q: `What if ${p.prescription ? "I don't have a prescription?" : "I'm on other medications?"}`, a: p.prescription ? "You must upload a valid prescription at checkout. Our pharmacists will verify it before dispatch." : "Always inform your doctor of all medications you're taking. While this is an OTC product, interactions are possible." },
                  { q: "Can I return this if it doesn't work for me?", a: "Yes — our 30-day hassle-free return policy covers unopened products. For opened products, contact our support team." },
                  { q: "How should I store this product?", a: `Store in a cool, dry place away from direct sunlight. Keep out of reach of children. Check the expiry date before use. Expires in approximately ${p.expiryMonths} months from manufacture.` },
                  { q: "How fast will this be delivered?", a: "Standard delivery: 24–48 hours. Express delivery (where available): 2 hours. Free delivery on orders over $49." },
                ].map((item, i) => (
                  <FAQItem key={i} q={item.q} a={item.a} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="border border-gray-100 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-sm text-gray-800">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-gray-400">
          <HelpCircle size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
