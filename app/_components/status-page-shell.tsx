"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface StatusPageShellProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  delay?: number;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function StatusPageShell({
  children,
  maxWidth = "sm",
  delay = 0.1,
}: StatusPageShellProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay,
          ease: [0.23, 1, 0.32, 1],
        }}
        className={cn("relative z-10 w-full px-6", maxWidthClasses[maxWidth])}
      >
        {children}
      </motion.div>
    </div>
  );
}
