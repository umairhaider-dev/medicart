"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { useCart } from "@/store/cartStore";
import Link from "next/link";

interface Props { product: Product }

export default function RelatedProducts({ product }: Props) {
  const { addItem } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory)
  ).slice(0, 8);

  if (related.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">
          You May Also <span className="gradient-text">Like</span>
        </h2>
        <div className="flex gap-2">
          {["left", "right"].map((dir) => (
            <motion.button
              key={dir}
              onClick={() => scroll(dir as "left" | "right")}
              className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:text-green-600 flex items-center justify-center text-gray-500 transition-all shadow-sm"
              whileTap={{ scale: 0.9 }}
            >
              {dir === "left" ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
            </motion.button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {related.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex-shrink-0 w-52 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
          >
            {/* Image */}
            <Link href={`/products/${p.id}`}>
              <div className={`h-36 bg-gradient-to-br ${p.bgColor} flex items-center justify-center relative`}>
                <motion.div
                  className="text-5xl select-none"
                  whileHover={{ scale: 1.15, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {p.image}
                </motion.div>
                {p.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    -{p.discount}%
                  </span>
                )}
              </div>
            </Link>

            <div className="p-3 space-y-2">
              <Link href={`/products/${p.id}`}>
                <p className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors leading-snug">
                  {p.name}
                </p>
              </Link>
              <p className="text-[10px] text-gray-400">{p.brand}</p>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[11px] font-bold text-gray-700">{p.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-gray-900">${p.price}</span>
                  {p.originalPrice > p.price && (
                    <span className="text-[10px] text-gray-400 line-through ml-1">${p.originalPrice}</span>
                  )}
                </div>
                <motion.button
                  onClick={() => addItem(p)}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-gradient-to-r ${p.color} text-white flex-shrink-0`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                >
                  + Add
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
