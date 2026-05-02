"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variants = {
  primary: "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-green-500/30 hover:from-green-600 hover:to-teal-600",
  secondary: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-teal-500/30",
  outline: "border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent",
  ghost: "text-green-600 hover:bg-green-50 bg-transparent",
  danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg hover:shadow-red-500/30",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-10 py-5 text-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled,
  type = "button",
  fullWidth,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        "btn-glow relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 cursor-pointer select-none",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
    </motion.button>
  );
}
