"use client";

import { MotionConfig } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { MOTION_KEY, motionOK } from "@/lib/motion";

/** Keeps Motion (motion.dev) in sync with the site-wide preference on <html>. */
export function MotionPrefs({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"user" | "never" | "always">("user");
  useEffect(() => setMode(motionOK() ? "never" : "always"), []);
  return <MotionConfig reducedMotion={mode}>{children}</MotionConfig>;
}

/** Lets visitors override their OS setting either way. Persisted per browser. */
export function MotionToggle() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => setOn(motionOK()), []);
  const toggle = () => {
    try {
      localStorage.setItem(MOTION_KEY, on ? "off" : "on");
    } catch {}
    window.location.reload();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on ?? undefined}
      className="mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-fg-3 transition-colors hover:text-fg"
    >
      <span className="relative inline-block h-[14px] w-[24px] rounded-full shadow-[inset_0_0_0_1px_var(--line-2)]">
        <span
          className="absolute top-[3px] h-2 w-2 rounded-full transition-all duration-300"
          style={{ left: on ? 13 : 3, background: on ? "var(--accent)" : "var(--fg-3)" }}
        />
      </span>
      Motion {on === null ? "" : on ? "on" : "off"}
    </button>
  );
}
