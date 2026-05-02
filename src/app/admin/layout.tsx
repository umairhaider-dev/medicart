"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Settings, Pill, Bell, Search, Menu, X, ChevronLeft,
  LogOut, Shield, TrendingUp, Zap, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",               icon: LayoutDashboard, label: "Dashboard",     badge: null },
  { href: "/admin/products",      icon: Package,         label: "Products",      badge: "30" },
  { href: "/admin/orders",        icon: ShoppingBag,     label: "Orders",        badge: "4"  },
  { href: "/admin/prescriptions", icon: FileText,        label: "Prescriptions", badge: "2"  },
  { href: "/admin/users",         icon: Users,           label: "Users",         badge: null },
  { href: "/admin/analytics",     icon: BarChart2,       label: "Analytics",     badge: null },
  { href: "/admin/settings",      icon: Settings,        label: "Settings",      badge: null },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full bg-gray-900 text-white transition-all duration-300",
      mobile ? "w-72" : collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-gray-800", collapsed && !mobile && "justify-center px-0")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-900/50">
          <Pill size={18} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <span className="font-black text-white text-base leading-none">MediCart</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield size={9} className="text-green-400" />
              <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Admin Panel</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 group relative",
                active
                  ? "bg-gradient-to-r from-green-500/20 to-teal-500/10 text-green-400 border border-green-500/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                collapsed && !mobile && "justify-center px-0 mx-1"
              )}
              title={collapsed && !mobile ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {(!collapsed || mobile) && (
                <>
                  <span className="text-sm font-semibold flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn("text-[10px] font-black px-1.5 py-0.5 rounded-full", active ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300")}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && !mobile && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Demo banner */}
      {(!collapsed || mobile) && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">Demo Mode</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">All data is mock. Connect a real database for production.</p>
        </div>
      )}

      {/* Bottom user area */}
      <div className={cn("border-t border-gray-800 p-3 flex items-center gap-3", collapsed && !mobile && "justify-center")}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">A</div>
        {(!collapsed || mobile) && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Admin User</p>
            <p className="text-[10px] text-gray-400 truncate">admin@medicart.com</p>
          </div>
        )}
        {(!collapsed || mobile) && (
          <Link href="/" className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex-shrink-0" title="Back to site">
            <LogOut size={14} />
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0 relative">
        <Sidebar />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center text-white hover:bg-gray-600 transition-colors z-10 shadow-lg"
        >
          <ChevronLeft size={12} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30 }} className="fixed inset-y-0 left-0 z-50 md:hidden">
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center gap-4 px-4 flex-shrink-0 shadow-sm">
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search products, orders, users…" className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-green-400 transition-colors" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 font-medium px-3 py-1.5 rounded-xl hover:bg-green-50 transition-colors">
              <TrendingUp size={13} /> View Store
            </Link>
            <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-black">A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
