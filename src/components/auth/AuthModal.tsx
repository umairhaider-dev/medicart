"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, Lock, User, Eye, EyeOff, Loader2,
  CheckCircle, AlertCircle, ArrowRight, Pill,
  Shield, Sparkles, Phone
} from "lucide-react";
import { useAuth } from "@/store/authStore";
import { cn } from "@/lib/utils";

const OVERLAY = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
const PANEL   = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

interface Field { value: string; error: string; touched: boolean }
function field(val = ""): Field { return { value: val, error: "", touched: false }; }

function validate(name: string, value: string, extra?: Record<string, string>): string {
  if (!value.trim()) return `${name} is required`;
  if (name === "Email" && !/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
  if (name === "Password" && value.length < 6) return "Password must be at least 6 characters";
  if (name === "Confirm password" && value !== extra?.password) return "Passwords do not match";
  if (name === "Full name" && value.trim().split(" ").length < 2) return "Enter your full name";
  return "";
}

function Input({ label, type = "text", value, error, touched, onChange, onBlur, icon: Icon, rightEl, placeholder }: {
  label: string; type?: string; value: string; error: string; touched: boolean;
  onChange: (v: string) => void; onBlur: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  rightEl?: React.ReactNode; placeholder?: string;
}) {
  const hasError = touched && error;
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Icon size={16} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors", hasError ? "text-red-400" : "text-gray-400")} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 rounded-xl border-2 text-sm bg-gray-50 focus:bg-white outline-none transition-all",
            hasError
              ? "border-red-300 focus:border-red-400"
              : "border-gray-100 focus:border-green-400"
          )}
        />
        {rightEl && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      <AnimatePresence>
        {hasError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuthModal() {
  const { modalOpen, modalTab, closeModal, login, register, isLoading, error, clearError, openModal } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(modalTab);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail]   = useState(field());
  const [pw, setPw]         = useState(field());
  const [name, setName]     = useState(field());
  const [confirm, setConfirm] = useState(field());
  const [phone, setPhone]   = useState(field());
  const [remember, setRemember] = useState(false);

  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => { setTab(modalTab); }, [modalTab]);
  useEffect(() => { clearError(); }, [tab, clearError]);

  const reset = () => {
    setEmail(field()); setPw(field()); setName(field());
    setConfirm(field()); setPhone(field()); setSuccess(false); setShowPw(false); setShowConfirm(false);
  };

  const switchTab = (t: "login" | "register") => { reset(); setTab(t); };

  const touch = (setter: React.Dispatch<React.SetStateAction<Field>>, value: string, label: string, extra?: Record<string, string>) => {
    setter({ value, error: validate(label, value, extra), touched: true });
  };

  const handleLogin = async () => {
    const emailErr = validate("Email", email.value);
    const pwErr    = validate("Password", pw.value);
    setEmail(p => ({ ...p, error: emailErr, touched: true }));
    setPw(p => ({ ...p, error: pwErr, touched: true }));
    if (emailErr || pwErr) return;
    const ok = await login(email.value, pw.value);
    if (ok) { setSuccess(true); setTimeout(() => { reset(); }, 1200); }
  };

  const handleRegister = async () => {
    const nameErr    = validate("Full name", name.value);
    const emailErr   = validate("Email", email.value);
    const pwErr      = validate("Password", pw.value);
    const confirmErr = validate("Confirm password", confirm.value, { password: pw.value });
    setName(p => ({ ...p, error: nameErr, touched: true }));
    setEmail(p => ({ ...p, error: emailErr, touched: true }));
    setPw(p => ({ ...p, error: pwErr, touched: true }));
    setConfirm(p => ({ ...p, error: confirmErr, touched: true }));
    if (nameErr || emailErr || pwErr || confirmErr) return;
    const ok = await register(name.value, email.value, pw.value);
    if (ok) { setSuccess(true); setTimeout(() => { reset(); }, 1400); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") tab === "login" ? handleLogin() : handleRegister();
  };

  if (!modalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        variants={OVERLAY} initial="hidden" animate="visible" exit="exit"
        className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <motion.div
          key="panel"
          variants={PANEL} initial="hidden" animate="visible" exit="exit"
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          onKeyDown={handleKey}
        >
          {/* Header gradient */}
          <div className="relative bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 px-7 pt-8 pb-10">
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Pill size={20} className="text-white" />
              </div>
              <div>
                <span className="text-white font-black text-xl">MediCart</span>
                <div className="text-white/70 text-xs">Your Health Partner</div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                  <CheckCircle className="text-white" size={28} />
                  <div>
                    <p className="text-white font-bold text-lg">
                      {tab === "login" ? "Welcome back!" : "Account created!"}
                    </p>
                    <p className="text-white/80 text-sm">You're now signed in.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-black text-white">
                    {tab === "login" ? "Sign in" : "Create account"}
                  </h2>
                  <p className="text-white/80 text-sm mt-0.5">
                    {tab === "login" ? "Welcome back! Enter your details." : "Join thousands of healthy users."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab switcher (overlapping the header) */}
          <div className="flex mx-6 -mt-5 bg-white rounded-2xl shadow-lg border border-gray-100 p-1 z-10 relative">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                  tab === t ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="px-7 py-6 space-y-4">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-6 gap-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <p className="text-gray-600 text-sm text-center">Redirecting you to your account…</p>
                </motion.div>
              ) : (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: tab === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-4"
                >
                  {/* Social login */}
                  <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all font-semibold text-sm text-gray-700">
                    <GoogleIcon />
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400 font-medium">or with email</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Register-only fields */}
                  {tab === "register" && (
                    <Input
                      label="Full name" icon={User} placeholder="John Smith"
                      value={name.value} error={name.error} touched={name.touched}
                      onChange={(v) => setName(p => ({ ...p, value: v, error: p.touched ? validate("Full name", v) : "" }))}
                      onBlur={() => touch(setName, name.value, "Full name")}
                    />
                  )}

                  <Input
                    label="Email address" type="email" icon={Mail} placeholder="you@example.com"
                    value={email.value} error={email.error} touched={email.touched}
                    onChange={(v) => setEmail(p => ({ ...p, value: v, error: p.touched ? validate("Email", v) : "" }))}
                    onBlur={() => touch(setEmail, email.value, "Email")}
                  />

                  <Input
                    label="Password" type={showPw ? "text" : "password"} icon={Lock} placeholder="••••••••"
                    value={pw.value} error={pw.error} touched={pw.touched}
                    onChange={(v) => setPw(p => ({ ...p, value: v, error: p.touched ? validate("Password", v) : "" }))}
                    onBlur={() => touch(setPw, pw.value, "Password")}
                    rightEl={
                      <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  {tab === "register" && (
                    <Input
                      label="Confirm password" type={showConfirm ? "text" : "password"} icon={Lock} placeholder="••••••••"
                      value={confirm.value} error={confirm.error} touched={confirm.touched}
                      onChange={(v) => setConfirm(p => ({ ...p, value: v, error: p.touched ? validate("Confirm password", v, { password: pw.value }) : "" }))}
                      onBlur={() => touch(setConfirm, confirm.value, "Confirm password", { password: pw.value })}
                      rightEl={
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600">
                          {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                    />
                  )}

                  {tab === "login" && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-500 focus:ring-green-400" />
                        <span className="text-xs text-gray-600">Remember me</span>
                      </label>
                      <button className="text-xs text-green-600 hover:text-green-700 font-semibold">Forgot password?</button>
                    </div>
                  )}

                  {/* API error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    onClick={tab === "login" ? handleLogin : handleRegister}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-green-300/50 hover:shadow-xl transition-all disabled:opacity-70"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isLoading ? (
                      <><Loader2 size={18} className="animate-spin" /> {tab === "login" ? "Signing in…" : "Creating account…"}</>
                    ) : (
                      <>{tab === "login" ? "Sign In" : "Create Account"} <ArrowRight size={16} /></>
                    )}
                  </motion.button>

                  {/* Switch hint */}
                  <p className="text-center text-xs text-gray-500">
                    {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => switchTab(tab === "login" ? "register" : "login")} className="text-green-600 font-bold hover:underline">
                      {tab === "login" ? "Register now" : "Sign in"}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer trust strip */}
          {!success && (
            <div className="px-7 pb-6 flex items-center justify-center gap-4 text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><Shield size={11} className="text-green-500" /> SSL Secured</span>
              <span className="flex items-center gap-1"><Sparkles size={11} className="text-teal-500" /> 500K+ users</span>
              <span className="flex items-center gap-1"><CheckCircle size={11} className="text-blue-500" /> HIPAA Compliant</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
