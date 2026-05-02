"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  mediCoins: number;
  memberSince: string;
  tier: "Silver" | "Gold" | "Platinum";
  isAdmin?: boolean;
  addresses: Address[];
  savedRx: string[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  modalOpen: boolean;
  modalTab: "login" | "register";
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAIL"; payload: string }
  | { type: "LOGOUT" }
  | { type: "OPEN_MODAL"; payload: "login" | "register" }
  | { type: "CLOSE_MODAL" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" };

interface AuthContext {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  modalOpen: boolean;
  modalTab: "login" | "register";
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  openModal: (tab?: "login" | "register") => void;
  closeModal: () => void;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
}

const INITIAL: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  modalOpen: false,
  modalTab: "login",
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":   return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS": return { ...state, isLoading: false, user: action.payload, modalOpen: false, error: null };
    case "LOGIN_FAIL":    return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":        return { ...state, user: null };
    case "OPEN_MODAL":    return { ...state, modalOpen: true, modalTab: action.payload, error: null };
    case "CLOSE_MODAL":   return { ...state, modalOpen: false, error: null };
    case "UPDATE_USER":   return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case "CLEAR_ERROR":   return { ...state, error: null };
    default: return state;
  }
}

const Ctx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  /* Hydrate — optimistic localStorage restore, then server validation */
  useEffect(() => {
    try {
      const cached = localStorage.getItem("mc_user");
      if (cached) dispatch({ type: "LOGIN_SUCCESS", payload: JSON.parse(cached) });
    } catch { /* ignore */ }

    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
          localStorage.setItem("mc_user", JSON.stringify(data.user));
        } else {
          dispatch({ type: "LOGOUT" });
          localStorage.removeItem("mc_user");
        }
      })
      .catch(() => { /* keep cached value on network error */ });
  }, []);

  /* Keep localStorage in sync as client-side cache */
  useEffect(() => {
    if (state.user) localStorage.setItem("mc_user", JSON.stringify(state.user));
    else localStorage.removeItem("mc_user");
  }, [state.user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: "LOGIN_FAIL", payload: data.error ?? "Login failed." });
        return false;
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      return true;
    } catch {
      dispatch({ type: "LOGIN_FAIL", payload: "Network error. Please try again." });
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch({ type: "LOGIN_FAIL", payload: data.error ?? "Registration failed." });
        return false;
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      return true;
    } catch {
      dispatch({ type: "LOGIN_FAIL", payload: "Network error. Please try again." });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    dispatch({ type: "LOGOUT" });
  }, []);

  const openModal = useCallback((tab: "login" | "register" = "login") => {
    dispatch({ type: "OPEN_MODAL", payload: tab });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: data });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return (
    <Ctx.Provider value={{
      user: state.user,
      isLoading: state.isLoading,
      error: state.error,
      isAuthenticated: !!state.user,
      modalOpen: state.modalOpen,
      modalTab: state.modalTab,
      login, register, logout, openModal, closeModal, updateUser, clearError,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
