"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";

export function AuthMotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function AuthReveal({
  children,
  className,
  delay = 0,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ delay, duration: 0.42, ease: "easeOut" }}
      whileHover={hover && !shouldReduceMotion ? { y: -3 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export function AuthStagger({
  children,
  className,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate="show"
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: shouldReduceMotion
            ? { delayChildren: 0 }
            : { delayChildren: delay, staggerChildren: 0.055 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AuthStaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.32, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
