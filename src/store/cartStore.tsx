"use client";
import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  promoCode: string;
  promoDiscount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QTY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "APPLY_PROMO"; code: string; discount: number }
  | { type: "REMOVE_PROMO" }
  | { type: "HYDRATE"; items: CartItem[] };

const PROMO_CODES: Record<string, number> = {
  SAVE10: 10, FIRST15: 15, HEALTH20: 20, MEDI30: 30,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };

    case "ADD_ITEM": {
      const qty = action.quantity ?? 1;
      const existing = state.items.find((i) => i.product.id === action.product.id);
      const newItems = existing
        ? state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: Math.min(i.quantity + qty, i.product.stock) }
              : i
          )
        : [...state.items, { product: action.product, quantity: qty, addedAt: Date.now() }];
      return { ...state, items: newItems, drawerOpen: true };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };

    case "UPDATE_QTY": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.min(action.quantity, i.product.stock) }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_DRAWER":   return { ...state, drawerOpen: true };
    case "CLOSE_DRAWER":  return { ...state, drawerOpen: false };
    case "TOGGLE_DRAWER": return { ...state, drawerOpen: !state.drawerOpen };

    case "APPLY_PROMO":
      return { ...state, promoCode: action.code, promoDiscount: action.discount };
    case "REMOVE_PROMO":
      return { ...state, promoCode: "", promoDiscount: 0 };

    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  // Computed
  itemCount: number;
  subtotal: number;
  savings: number;
  deliveryFee: number;
  tax: number;
  promoSaving: number;
  total: number;
  isEmpty: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "medicart_cart_v1";

const INITIAL: CartState = { items: [], drawerOpen: false, promoCode: "", promoDiscount: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const items: CartItem[] = JSON.parse(saved);
        dispatch({ type: "HYDRATE", items });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist items to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch { /* ignore */ }
  }, [state.items]);

  // Derived values
  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const savings  = state.items.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 49 ? 0 : 4.99;
  const tax      = subtotal * 0.085;
  const promoSaving = subtotal * (state.promoDiscount / 100);
  const total    = subtotal + deliveryFee + tax - promoSaving;
  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);

  const addItem    = useCallback((product: Product, quantity?: number) => dispatch({ type: "ADD_ITEM", product, quantity }), []);
  const removeItem = useCallback((productId: string) => dispatch({ type: "REMOVE_ITEM", productId }), []);
  const updateQty  = useCallback((productId: string, quantity: number) => dispatch({ type: "UPDATE_QTY", productId, quantity }), []);
  const clearCart  = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openDrawer  = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);
  const toggleDrawer = useCallback(() => dispatch({ type: "TOGGLE_DRAWER" }), []);
  const removePromo  = useCallback(() => dispatch({ type: "REMOVE_PROMO" }), []);

  const applyPromo = useCallback((code: string): { ok: boolean; message: string } => {
    const upper = code.toUpperCase().trim();
    const discount = PROMO_CODES[upper];
    if (!discount) return { ok: false, message: "Invalid promo code. Try SAVE10 or HEALTH20." };
    dispatch({ type: "APPLY_PROMO", code: upper, discount });
    return { ok: true, message: `${discount}% discount applied!` };
  }, []);

  return (
    <CartContext.Provider value={{
      state, addItem, removeItem, updateQty, clearCart,
      openDrawer, closeDrawer, toggleDrawer, applyPromo, removePromo,
      itemCount, subtotal, savings, deliveryFee, tax, promoSaving, total,
      isEmpty: state.items.length === 0,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
