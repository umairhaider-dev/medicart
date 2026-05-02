"use client";
import { motion } from "framer-motion";
import {
  Pill, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube,
  ArrowUp, Shield, Truck, Clock, Star
} from "lucide-react";

const footerLinks = {
  "Company": ["About Us", "Careers", "Press & Media", "Investor Relations", "Blog", "Affiliate Program"],
  "Products": ["Medicines", "Health Devices", "Vitamins & Supplements", "Baby Care", "Fitness", "Herbal Products"],
  "Support": ["Track Order", "Return Policy", "FAQ", "Contact Us", "Report a Problem", "Live Chat"],
  "Healthcare": ["Upload Prescription", "Talk to Pharmacist", "Health Blog", "Drug Information", "Symptoms Checker", "Health Records"],
};

const socials = [
  { icon: Facebook, color: "hover:bg-blue-600", href: "#" },
  { icon: Twitter, color: "hover:bg-sky-500", href: "#" },
  { icon: Instagram, color: "hover:bg-rose-500", href: "#" },
  { icon: Youtube, color: "hover:bg-red-600", href: "#" },
];

const paymentMethods = ["💳", "🏦", "📱", "🔐", "💰", "🌐"];

const quickBadges = [
  { icon: Shield, text: "Verified Pharmacy" },
  { icon: Truck, text: "Fast Delivery" },
  { icon: Clock, text: "24/7 Support" },
  { icon: Star, text: "Top Rated" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Top wave */}
      <div className="relative">
        <svg viewBox="0 0 1440 60" className="w-full fill-white">
          <path d="M0,60 L0,30 C240,60 480,0 720,20 C960,40 1200,0 1440,30 L1440,60 Z" />
        </svg>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-80 h-80 bg-green-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-900/20 rounded-full blur-3xl" />
      </div>

      <div className="px-4 sm:px-6 lg:px-10 xl:px-14 relative z-10">
        {/* Main footer content */}
        <div className="pt-12 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg shadow-green-900/30">
                <Pill className="text-white" size={22} />
              </div>
              <div>
                <span className="text-2xl font-black gradient-text">Medi</span>
                <span className="text-2xl font-black text-white">Cart</span>
                <div className="text-[9px] text-gray-500 font-medium -mt-0.5 tracking-widest uppercase">Your Health Partner</div>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s most trusted online pharmacy. Genuine medicines, expert advice, and fast delivery. Your health, our priority since 2019.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              {[
                { icon: Phone, text: "+1 800-MED-CART (24/7)" },
                { icon: Mail, text: "support@medicart.com" },
                { icon: MapPin, text: "123 Health Avenue, NY 10001" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-green-400 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-lg bg-gray-800 group-hover:bg-green-900/50 flex items-center justify-center transition-colors">
                    <item.icon size={13} className="text-green-500" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              {socials.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  className={`w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={16} className="text-gray-300" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold text-sm mb-4 relative">
                {category}
                <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-gradient-to-r from-green-500 to-transparent rounded-full" />
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges row */}
        <div className="py-6 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <badge.icon size={14} className="text-green-500" />
              {badge.text}
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="py-5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Secure Payments:</span>
            <div className="flex gap-2">
              {paymentMethods.map((pm, i) => (
                <span
                  key={i}
                  className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center text-sm border border-gray-700"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2025 MediCart Inc. All rights reserved. Serving your health since 2019.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"].map((link) => (
              <a key={link} href="#" className="hover:text-green-400 transition-colors">{link}</a>
            ))}
            <a href="/portal" className="hover:text-gray-400 transition-colors text-gray-700">Staff Portal</a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-xl shadow-green-900/30 flex items-center justify-center z-50 hover:shadow-2xl hover:shadow-green-900/50 transition-shadow"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
}
