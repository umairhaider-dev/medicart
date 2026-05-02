"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { Product } from "@/lib/products";

type Action =
  | { type: "ADD";     payload: Product }
  | { type: "REMOVE";  id: string }
  | { type: "HYDRATE"; payload: Product[] };

function reducer(items: Product[], action: Action): Product[] {
  switch (action.type) {
    case "HYDRATE": return action.payload;
    case "ADD":     return items.some(p => p.id === action.payload.id) ? items : [action.payload, ...items];
    case "REMOVE":  return items.filter(p => p.id !== action.id);
    default:        return items;
  }
}

interface WishlistCtx {
  items: Product[];
  toggle:       (product: Product) => boolean; // true = added
  isWishlisted: (id: string) => boolean;
  remove:       (id: string) => void;
  count:        number;
}

const Ctx = createContext<WishlistCtx | null>(null);
const KEY = "medicart_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  }, [items]);

  const toggle = useCallback((product: Product): boolean => {
    const exists = items.some(p => p.id === product.id);
    if (exists) { dispatch({ type: "REMOVE", id: product.id }); return false; }
    dispatch({ type: "ADD", payload: product });
    return true;
  }, [items]);

  const isWishlisted = useCallback((id: string) => items.some(p => p.id === id), [items]);
  const remove       = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);

  return (
    <Ctx.Provider value={{ items, toggle, isWishlisted, remove, count: items.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
