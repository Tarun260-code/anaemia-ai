"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion, type Variants } from "framer-motion";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants: Variants = {
  initial: { scale: 1, rotateX: 0 },
  hover: { scale: 1.02, rotateX: -2, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.98, rotateX: 2, transition: { type: "spring", stiffness: 400, damping: 10 } },
};

const shimmerVariants: Variants = {
  initial: { x: "-100%" },
  animate: { x: "100%", transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 } },
};

const animatedButtonVariants = cva(
  ["group relative inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold",
   "transition-all duration-200 ease-in-out outline-offset-2",
   "disabled:pointer-events-none disabled:opacity-50 overflow-hidden transform-gpu cursor-pointer"],
  {
    variants: {
      variant: {
        default: ["bg-[#FF2D4E] text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 border border-red-400/20"],
        outline: ["border-2 border-[#FF2D4E]/40 bg-transparent backdrop-blur-sm text-white hover:bg-[#FF2D4E]/10 hover:border-[#FF2D4E]"],
        gradient: ["bg-gradient-to-r from-[#C41230] via-[#FF2D4E] to-[#FF6B6B] bg-[length:200%_100%] text-white shadow-lg shadow-red-500/30"],
        gold: ["bg-gradient-to-r from-[#D4A843] via-[#FFD166] to-[#F4A261] text-[#1a0a0b] shadow-lg shadow-yellow-500/30 font-bold"],
        ghost: ["bg-transparent text-white hover:bg-white/5"],
      },
      size: {
        sm: "h-9 px-4 text-xs gap-1.5",
        md: "h-12 px-6 text-sm gap-2",
        lg: "h-14 px-8 text-base gap-2.5 w-full",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface AnimatedButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'>,
    VariantProps<typeof animatedButtonVariants> {
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ label, variant, size, iconLeft, iconRight, loading = false, className, onClick, disabled, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 600);
      onClick?.();
    };

    return (
      <motion.button
        ref={ref}
        className={cn(animatedButtonVariants({ variant, size }), className)}
        variants={buttonVariants}
        initial="initial"
        whileHover={!disabled && !loading ? "hover" : "initial"}
        whileTap={!disabled && !loading ? "tap" : "initial"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={label}
        aria-busy={loading}
        {...props}
      >
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          variants={shimmerVariants}
          initial="initial"
          animate={isHovered ? "animate" : "initial"}
        />

        {/* Glow */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/5 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : iconLeft && <span>{iconLeft}</span>}
          <span>{label}</span>
          {!loading && iconRight && <span>{iconRight}</span>}
        </span>

        {/* Ripples */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 1 }}
            animate={{ width: 150, height: 150, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
export { AnimatedButton, animatedButtonVariants };