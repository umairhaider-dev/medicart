"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Regular Customer",
    avatar: "👩‍💼",
    rating: 5,
    text: "MediCart has been an absolute lifesaver! I manage multiple medications for my elderly mother and the subscription feature ensures we never run out. The pharmacist chat is incredible — they helped us identify a drug interaction. Delivery is always on time.",
    location: "New York, NY",
    since: "Customer since 2021",
    verified: true,
    tag: "Subscription User",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: 2,
    name: "Dr. Rajesh Patel",
    role: "Healthcare Professional",
    avatar: "👨‍⚕️",
    rating: 5,
    text: "As a physician, I often recommend MediCart to my patients. The platform's prescription verification process is rigorous and I trust the authenticity of every medicine they stock. My patients report faster delivery than any local pharmacy.",
    location: "Chicago, IL",
    since: "Professional Partner",
    verified: true,
    tag: "Medical Partner",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Fitness Enthusiast",
    avatar: "👩‍🦱",
    rating: 5,
    text: "The supplements section is phenomenal. I've saved over $200 this month alone compared to retail prices, and everything arrives sealed and genuine. The smart recommendations based on my fitness goals are spot on!",
    location: "Los Angeles, CA",
    since: "Customer since 2022",
    verified: true,
    tag: "Top Reviewer",
    color: "from-pink-400 to-rose-500",
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "Startup Founder",
    avatar: "👨‍💻",
    rating: 5,
    text: "Incredibly fast delivery — ordered at 8 AM, received by 10 AM! The app is beautifully designed and the 24/7 pharmacist chat gave me peace of mind when I needed it at 2 AM. MediCart has truly revolutionized healthcare accessibility.",
    location: "San Francisco, CA",
    since: "Customer since 2023",
    verified: true,
    tag: "Express User",
    color: "from-violet-400 to-purple-500",
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Mother of Three",
    avatar: "👩",
    rating: 5,
    text: "Managing healthcare for a family of five was stressful until I found MediCart. The family health profile feature, auto-refill subscriptions, and medicine reminders have made everything so organized. Absolutely worth every penny!",
    location: "Austin, TX",
    since: "Customer since 2020",
    verified: true,
    tag: "Family Plan",
    color: "from-amber-400 to-orange-500",
  },
];

const tagColors: Record<string, string> = {
  "Subscription User": "bg-green-100 text-green-700",
  "Medical Partner": "bg-blue-100 text-blue-700",
  "Top Reviewer": "bg-rose-100 text-rose-700",
  "Express User": "bg-violet-100 text-violet-700",
  "Family Plan": "bg-amber-100 text-amber-700",
};

function StarRow() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-green-100 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-100 to-transparent rounded-full translate-x-1/2 translate-y-1/2 opacity-60" />
      </div>

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-yellow-200">
            <Star size={14} className="fill-yellow-500" />
            Customer Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 font-heading">
            Loved by <span className="gradient-text">2 Million+</span> Customers
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Real stories from real customers who trust MediCart with their health every day.
          </p>
        </motion.div>

        <div className="mb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${testimonials[current].color}`} />
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center text-center gap-3 md:w-44">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center text-4xl shadow-xl`}>
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonials[current].name}</div>
                      <div className="text-sm text-gray-500">{testimonials[current].role}</div>
                      <div className="text-xs text-gray-400 mt-0.5">📍 {testimonials[current].location}</div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tagColors[testimonials[current].tag]}`}>
                      {testimonials[current].tag}
                    </span>
                    {testimonials[current].verified && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px]">✓</span>
                        Verified Purchase
                      </span>
                    )}
                    <div className="text-xs text-gray-400">{testimonials[current].since}</div>
                  </div>
                  <div className="flex-1">
                    <Quote size={40} className="text-green-100 mb-4" />
                    <StarRow />
                    <blockquote className="text-lg text-gray-700 leading-relaxed mt-4 italic">
                      &ldquo;{testimonials[current].text}&rdquo;
                    </blockquote>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <motion.button onClick={prev} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-green-400 hover:text-green-600 shadow-sm transition-all" whileTap={{ scale: 0.9 }}>
              <ChevronLeft size={18} />
            </motion.button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-gradient-to-r from-green-500 to-teal-500" : "w-2 bg-gray-200"}`} />
              ))}
            </div>
            <motion.button onClick={next} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-green-400 hover:text-green-600 shadow-sm transition-all" whileTap={{ scale: 0.9 }}>
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => setCurrent(i)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-xl`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{t.name}</div>
                  <StarRow />
                </div>
                <MessageSquare size={16} className="ml-auto text-gray-300" />
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
