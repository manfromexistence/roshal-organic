"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const revealTransition = {
  duration: 0.46,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MarketingReveal({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2, margin: "0px 0px -72px 0px" }}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MarketingHoverSurface({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        transition: { duration: 0.18, ease: "easeOut" },
      }}
      viewport={{ once: false, amount: 0.18, margin: "0px 0px -72px 0px" }}
      transition={{ ...revealTransition, delay }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

export function MarketingMediaSurface({
  children,
  className,
  delay = 0,
}: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.012,
        transition: { duration: 0.24, ease: "easeOut" },
      }}
      viewport={{ once: false, amount: 0.2, margin: "0px 0px -72px 0px" }}
      transition={{ ...revealTransition, delay }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
