"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import GridLines from "@/components/system/GridLines";
import { ArrowUpRight } from "@/components/system/Icons";
import { problem } from "@/lib/content";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, pinMode } from "@/lib/motion";

/*
 * 8,700 dots, each one = 5,000. The whole field is the 43.5M annual violations,
 * 3,400 of them light up for the 17M danger-zone occurrences, and the camera dives
 * into a row of 19 dots for the 95,000 daily incidents. Every count is exact.
 */
const COLS = 116;
const ROWS = 75;
const N = COLS * ROWS; // 8,700 × 5,000 = 43.5M
const DANGER = 3_400; // × 5,000 = 17M
const DAY = { c0: 78, r0: 37, w: 19, h: 1 }; // 19 × 5,000 = 95,000

// Deterministic per-dot data, computed once.
const data = (() => {
  const hash = (i: number) => {
    let x = (i + 1) * 2654435761;
    x ^= x >>> 15;
    x = Math.imul(x, 2246822519);
    x ^= x >>> 13;
    return (x >>> 0) / 4294967296;
  };
  const h = new Float32Array(N);
  for (let i = 0; i < N; i++) h[i] = hash(i);
  const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => h[a] - h[b]);
  const danger = new Uint8Array(N);
  for (let k = 0; k < DANGER; k++) danger[order[k]] = 1;
  const wave = new Float32Array(N);
  const wave2 = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const c = i % COLS;
    const r = (i / COLS) | 0;
    wave[i] = Math.min(1, ((c + r * 0.9) / (COLS + ROWS * 0.9)) * 0.86 + h[i] * 0.14);
    wave2[i] = Math.min(1, h[(i * 7) % N] * 0.75 + (c / COLS) * 0.25);
  }
  return { danger, wave, wave2 };
})();

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Scene state from progress p in [0, 1]. */
function beats(p: number) {
  return {
    fill: clamp((p - 0.04) / 0.28),
    danger: clamp((p - 0.38) / 0.18),
    zoom: ease(clamp((p - 0.62) / 0.24)),
  };
}

function draw(canvas: HTMLCanvasElement, p: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const { fill, danger, zoom } = beats(p);
  // Whole-device-pixel spacing keeps the dense field even (fractional spacing causes moire).
  const raw = Math.min(W / COLS, H / ROWS);
  const pitch = raw * dpr < 10 ? Math.max(1, Math.floor(raw * dpr)) / dpr : raw;
  const ox = (W - pitch * COLS) / 2;
  const oy = (H - pitch * ROWS) / 2;

  // Zoom toward the 95-dot block, in log space so the dive feels continuous.
  const bx = ox + (DAY.c0 + DAY.w / 2) * pitch;
  const by = oy + (DAY.r0 + DAY.h / 2) * pitch;
  const Z = (W * 0.7) / (DAY.w * pitch);
  const s = Math.exp(Math.log(Z) * zoom);
  // Screen = (field - block) * s + anchor, with the anchor gliding from the block to center.
  const ax = bx + (W / 2 - bx) * zoom;
  const ay = by + (H / 2 - by) * zoom;
  const toX = (fx: number) => (fx - bx) * s + ax;
  const toY = (fy: number) => (fy - by) * s + ay;

  const r = Math.max(0.5, pitch * s * 0.3);
  const round = r > 1.6;
  const ink = "24,19,15";
  const orange = "220,100,32";

  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = `rgb(${pass === 0 ? ink : orange})`;
    for (let i = 0; i < N; i++) {
      const c = i % COLS;
      const row = (i / COLS) | 0;
      const inDay = c >= DAY.c0 && c < DAY.c0 + DAY.w && row >= DAY.r0 && row < DAY.r0 + DAY.h;
      // The day block reads as one color once the dive starts: it's vehicles, not the danger subset.
      const isDanger = data.danger[i] === 1 && danger > data.wave2[i] && !(inDay && zoom > 0.3);
      if ((pass === 1) !== isDanger) continue;

      const appear = clamp((fill - data.wave[i]) / 0.06);
      if (appear <= 0) continue;

      let a = 0.62 * appear;
      if (isDanger) a = 0.95 * appear;
      else a *= 1 - danger * 0.6;
      if (zoom > 0) {
        if (inDay) a = Math.max(a, (isDanger ? 0.95 : 0.85) * zoom + a * (1 - zoom));
        else a *= 1 - zoom * 0.88;
      }
      if (a < 0.01) continue;

      const X = toX(ox + (c + 0.5) * pitch);
      const Y = toY(oy + (row + 0.5) * pitch);
      if (X < -r || X > W + r || Y < -r || Y > H + r) continue;

      ctx.globalAlpha = a;
      if (round) {
        ctx.beginPath();
        ctx.arc(X, Y, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Snap to device pixels so the dense field stays crisp (no moire).
        const sz = Math.max(1 / dpr, Math.round(r * 2 * dpr) / dpr);
        ctx.fillRect(Math.round((X - sz / 2) * dpr) / dpr, Math.round((Y - sz / 2) * dpr) / dpr, sz, sz);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Outline the day block as the dive begins.
  if (zoom > 0.02) {
    const x0 = toX(ox + DAY.c0 * pitch);
    const y0 = toY(oy + DAY.r0 * pitch);
    const bw = DAY.w * pitch * s;
    const bh = DAY.h * pitch * s;
    const pad = 8 + 10 * zoom;
    const k = Math.min(26, bw * 0.12);
    ctx.strokeStyle = `rgba(${orange},${Math.min(1, zoom * 1.6)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const L = x0 - pad, T = y0 - pad, R = x0 + bw + pad, B = y0 + bh + pad;
    ctx.moveTo(L, T + k); ctx.lineTo(L, T); ctx.lineTo(L + k, T);
    ctx.moveTo(R - k, T); ctx.lineTo(R, T); ctx.lineTo(R, T + k);
    ctx.moveTo(R, B - k); ctx.lineTo(R, B); ctx.lineTo(R - k, B);
    ctx.moveTo(L + k, B); ctx.lineTo(L, B); ctx.lineTo(L, B - k);
    ctx.stroke();
  }
}

/** Static canvas for the stacked (mobile / motion-off) layout. */
function StaticField({ p }: { p: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const render = () => draw(c, p);
    render();
    const ro = new ResizeObserver(render);
    ro.observe(c);
    return () => ro.disconnect();
  }, [p]);
  return <canvas ref={ref} aria-hidden="true" className="aspect-[116/75] max-h-[460px] w-full" />;
}

const LEGEND = ["Each dot = 5,000 violations", "Orange = children in the crossing zone", "Each dot = 5,000 vehicles · one school day"];
const STATIC_P = [0.34, 0.6, 1];
const fmt = (s: (typeof problem.stats)[number]) => `${s.value.toLocaleString("en-US", { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })}${s.suffix}`;

function StatText({ s, i }: { s: (typeof problem.stats)[number]; i: number }) {
  return (
    <>
      <p className="mono text-[11px] uppercase tracking-[0.14em] text-fg-3">
        0{i + 1} / 03 · <span className="text-accent-ink">{s.label}</span>
      </p>
      <p className="t-stat mt-5 text-fg" style={{ fontSize: "clamp(4.5rem, 2rem + 7vw, 9.5rem)" }}>
        {fmt(s)}
      </p>
      <p className="t-title mt-5 max-w-[22ch] text-fg text-pretty">{s.body}</p>
      <p className="mt-6 text-[13px] leading-snug text-fg-3">
        <span className="mono mr-2 text-[10.5px] uppercase tracking-[0.14em]">Source</span>
        {s.sourceUrl ? (
          <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-fg-2 underline decoration-[var(--line-2)] underline-offset-4 hover:text-fg">
            {s.source}
            <ArrowUpRight className="ml-1 inline-block align-[-1px]" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <span className="text-fg-2">{s.source}</span>
        )}
      </p>
    </>
  );
}

export default function ScaleField() {
  const track = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const legend = useRef<HTMLSpanElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode() || !canvas.current) return;
      const c = canvas.current;
      let p = 0;
      let raf = 0;
      let active = -1;
      const render = () => {
        raf = 0;
        draw(c, p);
      };
      const queue = () => {
        if (!raf) raf = requestAnimationFrame(render);
      };
      const setActive = (k: number) => {
        if (k === active) return;
        active = k;
        panels.current.forEach((el, i) => el && (el.dataset.active = i === k ? "1" : "0"));
        if (legend.current) legend.current.textContent = LEGEND[k];
      };
      setActive(0);
      queue();
      const st = ScrollTrigger.create({
        trigger: track.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          p = self.progress;
          setActive(p < 0.36 ? 0 : p < 0.6 ? 1 : 2);
          const b = [beats(p).fill, beats(p).danger, beats(p).zoom];
          bars.current.forEach((el, i) => el && (el.style.transform = `scaleX(${b[i]})`));
          queue();
        },
      });
      const ro = new ResizeObserver(queue);
      ro.observe(c);
      return () => {
        st.kill();
        ro.disconnect();
        cancelAnimationFrame(raf);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={track} aria-labelledby="scale-title" className="track relative" style={{ "--track": "520svh" } as CSSProperties}>
      <h2 id="scale-title" className="sr-only">
        The scale of the problem
      </h2>

      {/* Pinned, scroll-driven version */}
      <div className="stick pin-only relative">
        <GridLines className="opacity-60" />
        <div className="frame relative flex h-full flex-col pb-10 pt-[calc(var(--nav-h)+28px)]">
          <div className="flex items-center justify-between">
            <p className="eyebrow signal">The scale of the problem</p>
            <p className="mono text-[11px] uppercase tracking-[0.12em] text-fg-3">
              <span ref={legend}>{LEGEND[0]}</span>
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="relative block h-px overflow-hidden bg-line-2">
                <span ref={(el) => { bars.current[i] = el; }} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
              </span>
            ))}
          </div>

          <div className="grid-12 mt-8 min-h-0 flex-1 items-center">
            <div className="relative col-span-8 h-full lg:col-span-4">
              {problem.stats.map((s, i) => (
                <div
                  key={s.label}
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  data-active={i === 0 ? "1" : "0"}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-[opacity,transform] duration-700 ease-out data-[active='0']:pointer-events-none data-[active='0']:translate-y-[calc(-50%+24px)] data-[active='0']:opacity-0"
                >
                  <StatText s={s} i={i} />
                </div>
              ))}
            </div>
            <div className="relative col-span-8 hidden h-full lg:col-span-8 lg:block">
              <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stacked version: phones and motion-off */}
      <div className="flow-only">
        {problem.stats.map((s, i) => (
          <div key={s.label} className="frame border-t border-line py-14 first:border-t-0">
            <StatText s={s} i={i} />
            <div className="mt-8">
              <StaticField p={STATIC_P[i]} />
              <p className="mono mt-3 text-[10.5px] uppercase tracking-[0.12em] text-fg-3">{LEGEND[i]}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
