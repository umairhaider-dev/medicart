"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  size?: "sm" | "md" | "lg";
  label?: boolean;
}

export default function QuantityManager({ value, min = 1, max = 99, onChange, size = "md", label = true }: Props) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(String(value));

  const set = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    onChange(clamped);
  };

  const commitEdit = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed)) set(parsed);
    else setInputVal(String(value));
    setEditing(false);
  };

  const s = {
    sm: { btn: "w-7 h-7", num: "w-10 text-sm", wrap: "rounded-xl gap-1 p-0.5" },
    md: { btn: "w-9 h-9", num: "w-12 text-base", wrap: "rounded-2xl gap-1.5 p-1" },
    lg: { btn: "w-11 h-11", num: "w-14 text-lg", wrap: "rounded-2xl gap-2 p-1" },
  }[size];

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</span>
      )}
      <div className={cn("inline-flex items-center bg-gray-50 border border-gray-200 w-fit", s.wrap)}>
        {/* Minus */}
        <motion.button
          onClick={() => set(value - 1)}
          disabled={value <= min}
          className={cn(
            "rounded-xl flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold flex-shrink-0",
            s.btn
          )}
          whileTap={{ scale: 0.8 }}
        >
          <Minus size={size === "lg" ? 16 : 13} strokeWidth={2.5} />
        </motion.button>

        {/* Value */}
        {editing ? (
          <input
            autoFocus
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => e.key === "Enter" && commitEdit()}
            className={cn("text-center font-black text-gray-900 bg-white border border-green-400 rounded-lg outline-none", s.num)}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.button
              key={value}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              onClick={() => { setInputVal(String(value)); setEditing(true); }}
              className={cn("text-center font-black text-gray-900 hover:bg-white rounded-lg transition-colors tabular-nums select-none cursor-text", s.num)}
            >
              {value}
            </motion.button>
          </AnimatePresence>
        )}

        {/* Plus */}
        <motion.button
          onClick={() => set(value + 1)}
          disabled={value >= max}
          className={cn(
            "rounded-xl flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0",
            s.btn
          )}
          whileTap={{ scale: 0.8 }}
        >
          <Plus size={size === "lg" ? 16 : 13} strokeWidth={2.5} />
        </motion.button>
      </div>
      {max < 20 && (
        <p className="text-[10px] text-orange-500 font-semibold">Max {max} per order</p>
      )}
    </div>
  );
}
