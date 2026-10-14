"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { motionOK, spring } from "@/lib/motion";

/** Pulls its child toward the cursor within `radius`. Translate only; inner label moves at half strength. */
export default function Magnetic({ children, strength = 0.32, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring.magnetic);
  const sy = useSpring(y, spring.magnetic);

  const move = (e: PointerEvent) => {
    if (!motionOK() || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`inline-block p-6 -m-6 ${className}`}>
      <motion.div style={{ x: sx, y: sy }}>
        {children}
      </motion.div>
    </div>
  );
}
