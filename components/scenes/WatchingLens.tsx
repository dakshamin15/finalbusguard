"use client";

import { useEffect, useRef, useState } from "react";
import { motionOK } from "@/lib/motion";

/**
 * A surveillance lens that tracks the cursor: today's stop-arm cameras watch and record,
 * they don't intervene. Transform-only motion; static on touch and with motion off.
 */
export default function WatchingLens() {
  const root = useRef<HTMLDivElement>(null);
  const iris = useRef<SVGGElement>(null);
  const glint = useRef<SVGGElement>(null);
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-US", { hour12: false });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!motionOK() || !window.matchMedia("(pointer: fine)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const move = (e: PointerEvent) => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 600);
      tx = (dx / d) * 26 * k;
      ty = (dy / d) * 26 * k;
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      if (iris.current) iris.current.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      if (glint.current) glint.current.style.transform = `translate(${(-x * 0.35).toFixed(2)}px, ${(-y * 0.35).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  const blades = Array.from({ length: 8 });

  return (
    <div ref={root} aria-hidden="true" className="lens relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Viewfinder */}
      <span className="brackets" style={{ "--bk": "34px" } as React.CSSProperties}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <div className="mono absolute left-5 top-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-fg">
        <span className="lens-rec inline-block h-2 w-2 rounded-full bg-[#d23a2a]" />
        Rec
      </div>
      <div className="mono absolute right-5 top-4 text-[11px] tracking-[0.12em] text-fg-2 tnum">{time}</div>
      <div className="mono absolute bottom-4 left-5 text-[10.5px] uppercase tracking-[0.14em] text-fg-3">Cam 01 · Plate capture</div>
      <div className="mono absolute bottom-4 right-5 text-[10.5px] uppercase tracking-[0.14em] text-accent-ink">No intervention</div>

      <svg viewBox="0 0 400 400" className="absolute inset-[11%] h-[78%] w-[78%] overflow-visible">
        <defs>
          <radialGradient id="glass" cx="50%" cy="45%" r="60%">
            <stop offset="0" stopColor="#3a2f28" />
            <stop offset="0.55" stopColor="#1c1612" />
            <stop offset="1" stopColor="#0d0a08" />
          </radialGradient>
          <radialGradient id="pupil" cx="45%" cy="40%" r="60%">
            <stop offset="0" stopColor="#2a1a10" />
            <stop offset="1" stopColor="#060403" />
          </radialGradient>
          <linearGradient id="barrel" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#5d5550" />
            <stop offset="0.5" stopColor="#2c2622" />
            <stop offset="1" stopColor="#47403b" />
          </linearGradient>
        </defs>

        {/* Housing and focus ring */}
        <circle cx="200" cy="200" r="196" fill="url(#barrel)" />
        <g className="lens-ring" style={{ transformOrigin: "200px 200px" }}>
          {Array.from({ length: 72 }).map((_, i) => (
            <line key={i} x1="200" y1="10" x2="200" y2={i % 6 === 0 ? 26 : 19} stroke="rgba(244,236,226,0.35)" strokeWidth="1.2" transform={`rotate(${i * 5} 200 200)`} />
          ))}
        </g>
        <circle cx="200" cy="200" r="160" fill="#1a1512" />
        <circle cx="200" cy="200" r="150" fill="url(#glass)" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(220,100,32,0.55)" strokeWidth="2" />

        {/* Iris: aperture blades + pupil, tracks the cursor */}
        <g ref={iris} style={{ willChange: "transform" }}>
          <g className="lens-iris" style={{ transformOrigin: "200px 200px" }}>
            {blades.map((_, i) => (
              <path
                key={i}
                d="M200 200 L200 92 A108 108 0 0 1 276 124 Z"
                fill={i % 2 ? "#2b211b" : "#241b16"}
                stroke="rgba(244,236,226,0.08)"
                transform={`rotate(${i * 45} 200 200)`}
              />
            ))}
          </g>
          <circle cx="200" cy="200" r="54" fill="url(#pupil)" />
          <circle cx="200" cy="200" r="54" fill="none" stroke="rgba(220,100,32,0.8)" strokeWidth="1.5" />
          <circle className="lens-core" cx="200" cy="200" r="10" fill="#dc6420" style={{ transformOrigin: "200px 200px" }} />
        </g>

        {/* Glass reflections drift opposite the iris */}
        <g ref={glint} style={{ willChange: "transform" }}>
          <ellipse cx="150" cy="140" rx="46" ry="22" fill="rgba(255,255,255,0.13)" transform="rotate(-35 150 140)" />
          <circle cx="252" cy="250" r="9" fill="rgba(255,255,255,0.12)" />
        </g>
      </svg>
    </div>
  );
}
