"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, ShoppingCart, Heart, User, Menu, X, ChevronDown,
  Bell, Pill, Stethoscope, Baby, Dumbbell, Leaf, Eye,
  Sparkles, Package, TrendingUp, Zap, LogOut, Settings, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchOverlay from "@/components/catalog/SearchOverlay";
import { useCart } from "@/store/cartStore";
import { useAuth } from "@/store/authStore";
import { useWishlist } from "@/store/wishlistStore";

const categories = [
  { name: "Medicines", icon: Pill, color: "text-green-500", bg: "bg-green-50", href: "/products?cat=Medicines" },
  { name: "Health Devices", icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-50", href: "/products?cat=Devices" },
  { name: "Baby Care", icon: Baby, color: "text-pink-500", bg: "bg-pink-50", href: "/products?cat=Baby+Care" },
  { name: "Fitness", icon: Dumbbell, color: "text-orange-500", bg: "bg-orange-50", href: "/products?cat=Fitness" },
  { name: "Herbal", icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-50", href: "/products?cat=Herbal" },
  { name: "Eye Care", icon: Eye, color: "text-purple-500", bg: "bg-purple-50", href: "/products" },
  { name: "Beauty", icon: Sparkles, color: "text-rose-500", bg: "bg-rose-50", href: "/products?cat=Beauty" },
];

const navLinks = [
  { name: "Home",          href: "/"              },
  { name: "Products",      href: "/products",      hasDropdown: true },
  { name: "Prescriptions", href: "/prescriptions" },
  { name: "Health Blog",   href: "/blog"          },
  { name: "Offers",        href: "/deals",         badge: "HOT" },
];


export default function Navbar() {
  const router = useRouter();
  const { itemCount: cartCount, toggleDrawer } = useCart();
  const { user, isAuthenticated, openModal, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setIsScrolled(v > 20));
    return () => unsub();
  }, [scrollY]);

  const handleSearch = (q: string) => {
    router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      {/* AI Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onSearch={handleSearch} />


      {/* Main Navbar */}
      <motion.header
        style={{ opacity: navOpacity }}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-green-100"
            : "bg-white/80 backdrop-blur-md"
        )}
      >
        <div className="px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2.5 flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md shadow-green-200">
                <Pill className="text-white" size={20} />
              </div>
              <div className="leading-none">
                <span className="text-xl font-black gradient-text">Medi</span>
                <span className="text-xl font-black text-gray-800">Cart</span>
                <div className="text-[9px] text-gray-400 font-medium -mt-0.5 tracking-widest uppercase">Your Health Partner</div>
              </div>
            </motion.a>

            {/* Search bar — desktop (triggers AI overlay) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex flex-1 max-w-xl items-center gap-3 bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-green-400 rounded-full px-4 py-2.5 text-left transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <Search size={17} className="text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
              <span className="text-sm text-gray-400 flex-1 text-left">Search medicines, health products...</span>
              <div className="flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0">
                <Sparkles size={10} className="animate-pulse" />
                AI
              </div>
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search */}
              <motion.button
                className="md:hidden p-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </motion.button>

              {/* Notification */}
              <motion.button
                className="hidden sm:flex p-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors relative"
                whileTap={{ scale: 0.9 }}
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden sm:flex p-2 rounded-full hover:bg-rose-50 text-gray-600 hover:text-rose-500 transition-colors relative">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart */}
              <motion.button
                onClick={toggleDrawer}
                className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-2 rounded-full shadow-md hover:shadow-green-300/50 hover:shadow-lg transition-all duration-300 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={18} />
                <span className="text-sm font-semibold hidden sm:inline">Cart</span>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-white text-green-600 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center -ml-0.5"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Profile / Avatar */}
              <div ref={userMenuRef} className="relative hidden sm:block">
                {isAuthenticated && user ? (
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 border-2 border-green-200 hover:border-green-400 px-2.5 py-1.5 rounded-full transition-all duration-300 bg-green-50"
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-black">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-green-700 max-w-[80px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={13} className={cn("text-green-600 transition-transform", userMenuOpen && "rotate-180")} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => openModal("login")}
                    className="flex items-center gap-1.5 border-2 border-gray-100 hover:border-green-300 px-3 py-1.5 rounded-full text-gray-700 hover:text-green-600 transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">Login</span>
                  </motion.button>
                )}

                {/* User dropdown */}
                <AnimatePresence>
                  {userMenuOpen && isAuthenticated && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="font-bold text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-600">🥇 {user.tier}</span>
                          <span className="text-[10px] text-gray-400">· {user.mediCoins} MediCoins</span>
                        </div>
                      </div>
                      {[
                        { icon: User, label: "My Profile", href: "/profile" },
                        { icon: Package, label: "My Orders", href: "/profile?tab=orders" },
                        { icon: Heart, label: "Wishlist", href: "/wishlist" },
                        { icon: Settings, label: "Settings", href: "/profile?tab=settings" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
                        >
                          <item.icon size={15} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                          {item.label}
                          <ChevronRight size={13} className="ml-auto text-gray-300" />
                        </Link>
                      ))}
                      <div className="border-t border-gray-50">
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-500 group"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu */}
              <motion.button
                className="md:hidden p-2 rounded-full hover:bg-green-50 text-gray-700"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 pb-2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <button
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    {link.name}
                    <motion.span animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
                  >
                    {link.name}
                    {link.badge && (
                      <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}

            <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Package size={12} className="text-green-500" />
                Track Order
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-teal-500" />
                Health Blog
              </span>
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-yellow-500" />
                Flash Deals
              </span>
            </div>
          </nav>
        </div>

        {/* Categories dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-green-100 shadow-2xl"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-6">
                <div className="grid grid-cols-7 gap-4">
                  {categories.map((cat, i) => (
                    <motion.a
                      key={cat.name}
                      href={cat.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", cat.bg)}>
                        <cat.icon size={22} className={cat.color} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">{cat.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile search is handled by SearchOverlay */}
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="font-bold text-lg gradient-text">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X size={22} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-green-50 text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                  {link.badge && (
                    <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">{link.badge}</span>
                  )}
                </motion.a>
              ))}
              <hr className="my-4 border-gray-100" />
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat, i) => (
                  <motion.a
                    key={cat.name}
                    href={cat.href}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-green-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat.bg)}>
                      <cat.icon size={18} className={cat.color} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{cat.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 space-y-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 border border-green-100">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-green-600 font-semibold">{user.tier} Member</p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-colors">
                    <User size={18} /> My Profile
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-red-200 text-red-500 font-semibold hover:bg-red-50 transition-colors">
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { openModal("login"); setMobileOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-green-500 text-green-600 font-semibold hover:bg-green-50 transition-colors">
                  <User size={18} /> Sign In / Register
                </button>
              )}
              <button onClick={toggleDrawer} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:shadow-lg transition-all">
                <ShoppingCart size={18} /> View Cart ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
