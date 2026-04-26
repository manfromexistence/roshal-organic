"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function AnimatedGradient({
  children,
  className,
  containerClassName,
}: AnimatedGradientProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 opacity-30 blur-3xl",
          "bg-gradient-to-r from-primary via-accent to-primary",
          className,
        )}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
