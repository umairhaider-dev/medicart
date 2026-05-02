"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface Props {
  item: CartItemType;
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: Props) {
  const { removeItem, updateQty } = useCart();
  const { product: p, quantity } = item;
  const lineTotal = (p.price * quantity).toFixed(2);
  const lineSaving = ((p.originalPrice - p.price) * quantity).toFixed(2);
  const isLowStock = p.stock - quantity < 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-green-100 hover:shadow-md transition-all duration-300",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className={cn("flex gap-3", compact ? "items-center" : "items-start")}>
        {/* Product visual */}
        <div className={cn(
          `rounded-xl bg-gradient-to-br ${p.bgColor} flex items-center justify-center flex-shrink-0`,
          compact ? "w-14 h-14 text-3xl" : "w-20 h-20 text-4xl"
        )}>
          {p.image}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className={cn("font-bold text-gray-900 leading-snug truncate", compact ? "text-xs" : "text-sm")}>
                {p.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {p.brand} · {p.form}{p.strength ? ` · ${p.strength}` : ""}
              </p>
              {p.prescription && (
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold mt-0.5">
                  <AlertTriangle size={9} /> Rx Required
                </span>
              )}
            </div>

            {/* Remove */}
            <motion.button
              onClick={() => removeItem(p.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
              whileTap={{ scale: 0.85 }}
              title="Remove item"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>

          <div className={cn("flex items-center justify-between mt-2", compact && "mt-1.5")}>
            {/* Quantity stepper */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl border border-gray-100 p-0.5">
              <motion.button
                onClick={() => updateQty(p.id, quantity - 1)}
                className={cn(
                  "rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white transition-all",
                  compact ? "w-6 h-6" : "w-7 h-7"
                )}
                whileTap={{ scale: 0.85 }}
              >
                <Minus size={compact ? 10 : 12} />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className={cn("font-bold text-gray-900 tabular-nums text-center min-w-[24px]", compact ? "text-xs" : "text-sm")}
                >
                  {quantity}
                </motion.span>
              </AnimatePresence>

              <motion.button
                onClick={() => updateQty(p.id, quantity + 1)}
                disabled={quantity >= p.stock}
                className={cn(
                  "rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white transition-all disabled:opacity-30",
                  compact ? "w-6 h-6" : "w-7 h-7"
                )}
                whileTap={{ scale: 0.85 }}
              >
                <Plus size={compact ? 10 : 12} />
              </motion.button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className={cn("font-black text-gray-900", compact ? "text-sm" : "text-base")}>
                ${lineTotal}
              </p>
              {Number(lineSaving) > 0 && (
                <p className="text-[10px] text-green-600 font-semibold">saved ${lineSaving}</p>
              )}
            </div>
          </div>

          {/* Low stock warning */}
          {!compact && isLowStock && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-[10px] text-orange-500 font-semibold flex items-center gap-1 mt-1.5"
            >
              <AlertTriangle size={9} /> Only {p.stock - quantity} more in stock
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
