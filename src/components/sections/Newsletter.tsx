"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Gift, Bell, Sparkles, CheckCircle } from "lucide-react";

const benefits = [
  { icon: Gift, text: "Get 15% OFF your first order" },
  { icon: Bell, text: "Flash deal alerts before anyone" },
  { icon: Sparkles, text: "Exclusive member-only offers" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) { setStatus("error"); return; }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setEmail("");
  };

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-teal-600 to-cyan-700">
        {/* Animated blobs */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%)" }}
          animate={{ x: [-100, 100, -100], y: [-50, 80, -50] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25), transparent 70%)" }}
          animate={{ x: [100, -80, 100], y: [50, -60, 50] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating icons */}
      {["💊", "🩺", "🧬", "💉", "🌿", "❤️"].map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-10 pointer-events-none select-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
      ))}

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30"
          >
            <Mail size={15} />
            Join 500,000+ Health-Conscious Members
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 font-heading leading-tight">
            Stay Ahead of
            <br />
            <span className="text-green-200">Your Health Game</span>
          </h2>

          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Subscribe to get exclusive deals, health tips from certified pharmacists, new product alerts, and your first order discount.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-white"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <b.icon size={14} />
                </div>
                <span className="text-sm font-medium text-green-100">{b.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Email form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 text-center"
                >
                  <motion.div
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-5xl mb-4"
                  >
                    🎉
                  </motion.div>
                  <div className="flex items-center justify-center gap-2 text-white font-bold text-xl mb-2">
                    <CheckCircle size={24} className="text-green-300" />
                    You&apos;re in!
                  </div>
                  <p className="text-green-100">Check your inbox for your 15% discount code. Welcome to the MediCart family!</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                      placeholder="Enter your email address"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 text-sm font-medium transition-all ${
                        status === "error" ? "ring-4 ring-red-400" : "focus:ring-green-300/50"
                      }`}
                    />
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-6 left-0 text-xs text-red-200 font-medium"
                      >
                        Please enter a valid email address
                      </motion.p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-gradient-to-r from-orange-400 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-70"
                    whileHover={{ scale: status === "loading" ? 1 : 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {status === "loading" ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Get 15% OFF
                        <ArrowRight size={16} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {status !== "success" && (
              <p className="text-green-200/70 text-xs mt-4 text-center">
                🔒 No spam, ever. Unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
              </p>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <div className="flex -space-x-2">
              {["👩", "👨", "👩‍🦱", "🧑", "👨‍🦰"].map((avatar, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-teal-500 bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-sm"
                >
                  {avatar}
                </div>
              ))}
            </div>
            <p className="text-green-100 text-sm">
              <span className="font-bold text-white">500K+</span> subscribers are already saving on health
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
