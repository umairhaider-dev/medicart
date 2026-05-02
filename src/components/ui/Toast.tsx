"use client";
import { createContext, useContext, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X, Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "wishlist" | "cart";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  desc?: string;
}

interface ToastCtxValue {
  show:    (opts: Omit<ToastItem, "id">) => void;
  success: (title: string, desc?: string) => void;
  error:   (title: string, desc?: string) => void;
  info:    (title: string, desc?: string) => void;
}

const Ctx = createContext<ToastCtxValue | null>(null);

const META: Record<ToastType, {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  ring: string;
  iconCls: string;
}> = {
  success:  { icon: CheckCircle,  ring: "border-green-200 bg-green-50",  iconCls: "text-green-500" },
  error:    { icon: AlertCircle,  ring: "border-red-200 bg-red-50",      iconCls: "text-red-500"   },
  info:     { icon: Info,         ring: "border-blue-200 bg-blue-50",    iconCls: "text-blue-500"  },
  wishlist: { icon: Heart,        ring: "border-rose-200 bg-rose-50",    iconCls: "text-rose-500"  },
  cart:     { icon: ShoppingCart, ring: "border-teal-200 bg-teal-50",    iconCls: "text-teal-500"  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const show = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = `t${Date.now()}${Math.random().toString(36).slice(2)}`;
    setToasts(p => [...p.slice(-3), { ...opts, id }]);
    timers.current[id] = setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const success = useCallback((title: string, desc?: string) => show({ type: "success", title, desc }), [show]);
  const error   = useCallback((title: string, desc?: string) => show({ type: "error",   title, desc }), [show]);
  const info    = useCallback((title: string, desc?: string) => show({ type: "info",    title, desc }), [show]);

  return (
    <Ctx.Provider value={{ show, success, error, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const { icon: Icon, ring, iconCls } = META[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={cn(
                  "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-xl shadow-black/10 max-w-[300px] min-w-[220px] backdrop-blur-sm",
                  ring
                )}
              >
                <Icon size={18} className={cn("flex-shrink-0 mt-0.5", iconCls)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{t.title}</p>
                  {t.desc && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.desc}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 p-0.5 rounded-lg hover:bg-black/5 transition-colors ml-1 mt-0.5"
                >
                  <X size={13} className="text-gray-400" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
