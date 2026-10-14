"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Close } from "./Icons";
import { bezier } from "@/lib/motion";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** Extra controls rendered in the dialog chrome (e.g. gallery prev/next). */
  controls?: ReactNode;
  onKey?: (e: KeyboardEvent) => void;
};

/** Accessible modal: focus trap, Esc to close, focus returns to the trigger, smooth scroll paused. */
export default function Lightbox({ open, onClose, label, children, controls, onKey }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cb = useRef({ onClose, onKey });
  cb.current = { onClose, onKey };

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement;
    window.__lenis?.stop();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cb.current.onClose();
        return;
      }
      cb.current.onKey?.(e);
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('button, [href], iframe, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const firstEl = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", key);
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());

    return () => {
      document.removeEventListener("keydown", key);
      html.style.overflow = prevOverflow;
      window.__lenis?.start();
      returnTo.current?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lb"
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: bezier.snap }}
        >
          <button aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-zoom-out bg-[rgba(var(--bg-rgb),0.95)]" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className="relative z-10 w-full max-w-6xl"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.5, ease: bezier.out }}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="eyebrow truncate text-fg">{label}</p>
              <div className="flex items-center gap-2">
                {controls}
                <button
                  data-autofocus
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="grid h-10 w-10 place-items-center rounded-full text-fg shadow-[inset_0_0_0_1px_var(--line-2)] transition-colors hover:bg-[rgba(var(--fg-rgb),0.06)]"
                >
                  <Close />
                </button>
              </div>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
