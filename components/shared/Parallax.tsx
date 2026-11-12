"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

type ParallaxProps = {
  children?: ReactNode;
  className?: string;
  /**
   * How far (px) the element drifts while it crosses the viewport.
   * Positive = moves slower than the page (sinks back); negative = faster.
   */
  distance?: number;
};

/**
 * Reusable scroll parallax. Transform-only (GPU friendly, no layout shift)
 * and disabled automatically for users who prefer reduced motion.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-distance, distance],
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
