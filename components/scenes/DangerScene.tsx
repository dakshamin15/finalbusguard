"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, motionOK, pinMode } from "@/lib/motion";

/*
 * "What one violation looks like": eye level in the crossing lane at dusk.
 * Lane dashes rush in, the stop arm swings out, a car's headlights grow out of
 * the horizon and never slow. Canvas for the road and light; DOM for the arm and
 * captions (transform/opacity only). No statistics: it illustrates the live copy.
 */

const BEATS = [
  { at: 0, text: "Every school day, a bus stops." },
  { at: 0.2, text: "The stop arm swings out." },
  { at: 0.42, text: "A driver doesn’t stop." },
  { at: 0.66, text: "A child is in the crossing zone." },
  { at: 0.86, text: "A camera records the plate. Nothing warns the child." },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function draw(c: HTMLCanvasElement, p: number, t: number) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = c.clientWidth;
  const H = c.clientHeight;
  if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const hz = H * 0.44; // horizon
  const vx = W * 0.56; // vanishing point x
  const near = H * 1.02;

  // Dusk sky
  const sky = ctx.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, "#e9b48c");
  sky.addColorStop(0.55, "#f3cfae");
  sky.addColorStop(1, "#f8e3cc");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, hz + 1);
  // Low sun haze at the horizon
  const sun = ctx.createRadialGradient(vx, hz, 0, vx, hz, W * 0.45);
  sun.addColorStop(0, "rgba(255,236,210,0.9)");
  sun.addColorStop(1, "rgba(255,236,210,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, hz);

  // Ground and verges
  const ground = ctx.createLinearGradient(0, hz, 0, H);
  ground.addColorStop(0, "#9b8a78");
  ground.addColorStop(1, "#5b4c40");
  ctx.fillStyle = ground;
  ctx.fillRect(0, hz, W, H - hz);

  // Road
  const roadHalfNear = W * 0.95;
  const roadHalfFar = W * 0.012;
  const road = ctx.createLinearGradient(0, hz, 0, H);
  road.addColorStop(0, "#6e625a");
  road.addColorStop(1, "#2f2823");
  ctx.fillStyle = road;
  ctx.beginPath();
  ctx.moveTo(vx - roadHalfFar, hz);
  ctx.lineTo(vx + roadHalfFar, hz);
  ctx.lineTo(vx + roadHalfNear, near);
  ctx.lineTo(vx - roadHalfNear, near);
  ctx.closePath();
  ctx.fill();

  // Edge lines
  ctx.strokeStyle = "rgba(255,248,238,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(vx - roadHalfFar * 0.9, hz);
  ctx.lineTo(vx - roadHalfNear * 0.92, near);
  ctx.moveTo(vx + roadHalfFar * 0.9, hz);
  ctx.lineTo(vx + roadHalfNear * 0.92, near);
  ctx.stroke();

  // Center dashes rush toward the viewer (driven by scroll, with a little idle drift)
  const drift = p * 7 + t * 0.06;
  const N = 16;
  for (let k = 0; k < N; k++) {
    const u = (k / N + drift) % 1;
    const d = Math.pow(u, 2.6);
    const y = hz + (near - hz) * d;
    const h = 2 + 70 * d;
    const w = 1 + 22 * d;
    ctx.globalAlpha = smooth(0, 0.08, u) * 0.85;
    ctx.fillStyle = "#f6e7c8";
    ctx.fillRect(vx - w / 2, y - h / 2, w, h);
  }
  ctx.globalAlpha = 1;

  // The car: headlights out of the horizon, growing as it closes
  const a = smooth(0.34, 0.98, p);
  if (a > 0) {
    const e = Math.pow(a, 2.2);
    const cy = hz + (near - hz) * e * 0.5;
    const sep = W * (0.012 + 0.2 * e);
    const r = 2 + 30 * e;
    // Car front: shadow, windshield, body, grille, bumper
    const bw = sep * 2.05;
    const bh = sep * 0.56;
    const bx = vx - bw / 2;
    const by = cy - bh * 0.5;
    const rr = Math.min(bh * 0.35, 36);
    ctx.fillStyle = `rgba(24,19,15,${0.35 * a})`;
    ctx.beginPath();
    ctx.ellipse(vx, by + bh * 1.02, bw * 0.58, bh * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    const wsTop = bw * 0.6;
    const wsBot = bw * 0.84;
    const wsH = bh * 0.78;
    const ws = ctx.createLinearGradient(0, by - wsH, 0, by);
    ws.addColorStop(0, "#5b4f47");
    ws.addColorStop(1, "#2a231f");
    ctx.fillStyle = ws;
    ctx.beginPath();
    ctx.moveTo(vx - wsTop / 2, by - wsH);
    ctx.lineTo(vx + wsTop / 2, by - wsH);
    ctx.lineTo(vx + wsBot / 2, by + 1);
    ctx.lineTo(vx - wsBot / 2, by + 1);
    ctx.closePath();
    ctx.fill();
    // sky reflection on the glass
    ctx.fillStyle = "rgba(248,215,180,0.18)";
    ctx.beginPath();
    ctx.moveTo(vx - wsTop * 0.42, by - wsH * 0.92);
    ctx.lineTo(vx - wsTop * 0.1, by - wsH * 0.92);
    ctx.lineTo(vx - wsBot * 0.28, by - wsH * 0.1);
    ctx.lineTo(vx - wsBot * 0.46, by - wsH * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3d332d";
    ctx.beginPath();
    ctx.moveTo(bx + rr, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + bh, rr);
    ctx.arcTo(bx + bw, by + bh, bx, by + bh, rr * 0.5);
    ctx.arcTo(bx, by + bh, bx, by, rr * 0.5);
    ctx.arcTo(bx, by, bx + bw, by, rr);
    ctx.fill();
    ctx.fillStyle = "#211b17";
    ctx.fillRect(vx - bw * 0.2, by + bh * 0.42, bw * 0.4, bh * 0.26);
    ctx.fillStyle = "rgba(255,240,220,0.18)";
    ctx.fillRect(bx + bw * 0.06, by + bh * 0.84, bw * 0.88, Math.max(1, bh * 0.05));
    // Beams on the asphalt
    ctx.globalCompositeOperation = "lighter";
    for (const s of [-1, 1]) {
      const hx = vx + s * sep * 0.72;
      const beam = ctx.createLinearGradient(0, cy, 0, near);
      beam.addColorStop(0, `rgba(255,236,196,${0.28 * a})`);
      beam.addColorStop(1, "rgba(255,236,196,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(hx - r * 0.6, cy);
      ctx.lineTo(hx + r * 0.6, cy);
      ctx.lineTo(hx + s * W * 0.5 + W * 0.25, near);
      ctx.lineTo(hx + s * W * 0.5 - W * 0.25, near);
      ctx.closePath();
      ctx.fill();
      // Lamp + bloom
      const g = ctx.createRadialGradient(hx, cy + bh * 0.05, 0, hx, cy + bh * 0.05, r * 6);
      g.addColorStop(0, "rgba(255,252,240,1)");
      g.addColorStop(0.18, "rgba(255,226,170,0.85)");
      g.addColorStop(0.5, "rgba(236,124,52,0.25)");
      g.addColorStop(1, "rgba(236,124,52,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(hx, cy + bh * 0.05, r * 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // Glare washes the frame as the car arrives
  const glare = smooth(0.8, 1, p);
  if (glare > 0) {
    ctx.fillStyle = `rgba(255,246,232,${glare * 0.3})`;
    ctx.fillRect(0, 0, W, H);
  }
}

export default function DangerScene() {
  const track = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const arm = useRef<HTMLDivElement>(null);
  const caps = useRef<(HTMLParagraphElement | null)[]>([]);
  const hud = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  // Static frame for phones / motion off
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    if (pinMode()) return;
    const render = () => draw(c, 0.72, 0);
    render();
    const ro = new ResizeObserver(render);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const { ScrollTrigger, gsap } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode() || !canvas.current) return;
      const c = canvas.current;
      let p = 0;
      let raf = 0;
      let active = -1;
      let visible = false;
      const t0 = performance.now();
      const loop = () => {
        draw(c, p, (performance.now() - t0) / 1000);
        raf = visible && motionOK() ? requestAnimationFrame(loop) : 0;
      };
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(loop);
      };
      const st = ScrollTrigger.create({
        trigger: track.current,
        start: "top top",
        end: "bottom bottom",
        onToggle: (s) => {
          visible = s.isActive;
          if (visible) kick();
        },
        onUpdate: (s) => {
          p = s.progress;
          // Stop arm swings out between 0.18 and 0.3
          const swing = Math.min(1, Math.max(0, (p - 0.16) / 0.14));
          const ease = 1 - Math.pow(1 - swing, 3);
          if (arm.current) {
            arm.current.style.transform = `rotate(${(-92 + 92 * ease).toFixed(2)}deg)`;
            arm.current.style.opacity = Math.min(1, swing * 3).toFixed(3);
          }
          // Captions
          let k = 0;
          BEATS.forEach((b, i) => {
            if (p >= b.at) k = i;
          });
          if (k !== active) {
            active = k;
            caps.current.forEach((el, i) => el && (el.dataset.on = i === k ? "1" : i < k ? "past" : "0"));
          }
          if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
          if (hud.current) hud.current.dataset.stage = p < 0.2 ? "0" : p < 0.42 ? "1" : p < 0.86 ? "2" : "3";
          kick();
        },
      });
      // Draw once even before the user reaches it
      draw(c, 0, 0);
      const ro = new ResizeObserver(() => draw(c, p, (performance.now() - t0) / 1000));
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
    <section ref={track} aria-labelledby="danger-title" className="track relative" style={{ "--track": "460svh" } as CSSProperties}>
      <div className="stick relative">
        <div className="relative h-[72svh] min-h-[420px] w-full overflow-hidden md:h-full">
          <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />

          {/* Stop arm in the foreground (left), hinged off-frame */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-[4vw] top-[30%] origin-left" style={{ width: "min(34vw, 380px)" }}>
            <div ref={arm} className="origin-left will-change-transform [.motion-ok_&]:md:[transform:rotate(-92deg)] [.motion-ok_&]:md:opacity-0">
              <svg viewBox="0 0 380 200" className="w-full drop-shadow-[0_24px_30px_rgba(24,19,15,0.35)]">
                <rect x="0" y="92" width="210" height="16" rx="4" fill="#3a302a" />
                <g transform="translate(290 100)">
                  <polygon
                    points={Array.from({ length: 8 })
                      .map((_, i) => {
                        const a = (Math.PI / 4) * i + Math.PI / 8;
                        return `${(Math.cos(a) * 86).toFixed(1)},${(Math.sin(a) * 86).toFixed(1)}`;
                      })
                      .join(" ")}
                    fill="#c8372d"
                    stroke="#fff8ef"
                    strokeWidth="7"
                  />
                  <text x="0" y="14" textAnchor="middle" fontSize="44" fontWeight="800" fill="#fff8ef" style={{ fontFamily: "var(--font-archivo)", letterSpacing: "0.02em" }}>
                    STOP
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* HUD */}
          <div className="absolute inset-x-0 top-0 pt-[calc(var(--nav-h)+24px)]">
            <div className="frame flex items-start justify-between">
              <div>
                <p className="eyebrow signal !text-ink">One stop, in slow motion</p>
                <h2 id="danger-title" className="t-m mt-4 max-w-[16ch] text-ink">
                  What one violation looks like.
                </h2>
              </div>
              <div ref={hud} data-stage="0" aria-hidden="true" className="group mono hidden text-right text-[11px] uppercase tracking-[0.14em] text-ink md:block">
                <p className="flex items-center justify-end gap-2">
                  <span className="lens-rec inline-block h-2 w-2 rounded-full bg-[#c8372d]" /> Rec · Plate capture
                </p>
                <p className="mt-2 opacity-60 group-data-[stage='0']:opacity-30">Stop arm: <span className="group-data-[stage='0']:hidden">Extended</span><span className="hidden group-data-[stage='0']:inline">Folded</span></p>
                <p className="mt-1 opacity-30 transition-opacity group-data-[stage='2']:opacity-100 group-data-[stage='3']:opacity-100">Vehicle: not slowing</p>
                <p className="mt-1 text-[#a3311f] opacity-0 transition-opacity group-data-[stage='3']:opacity-100">Alert issued: none</p>
              </div>
            </div>
          </div>

          {/* Captions */}
          <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <div className="frame">
              <div className="relative hidden h-[clamp(5rem,4rem+4vw,9rem)] md:block">
                {BEATS.map((b, i) => (
                  <p
                    key={b.text}
                    ref={(el) => {
                      caps.current[i] = el;
                    }}
                    data-on={i === 0 ? "1" : "0"}
                    aria-hidden="true"
                    className="font-display absolute bottom-0 left-0 max-w-[20ch] text-[clamp(2rem,1.2rem+2.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.04em] text-[#fff8ef] transition-[opacity,transform] duration-700 ease-out data-[on='0']:translate-y-8 data-[on='0']:opacity-0 data-[on='past']:-translate-y-8 data-[on='past']:opacity-0"
                    style={{ textShadow: "0 2px 24px rgba(24,19,15,0.35)" }}
                  >
                    {b.text}
                  </p>
                ))}
              </div>
              <div className="mt-4 hidden h-px w-full overflow-hidden bg-[rgba(255,248,239,0.3)] md:block" aria-hidden="true">
                <span ref={bar} className="block h-full origin-left scale-x-0 bg-[#fff8ef]" />
              </div>
            </div>
          </div>
        </div>

        {/* Screen-reader text for the pinned version */}
        <ol className="pin-only sr-only">
          {BEATS.map((b) => (
            <li key={b.text}>{b.text}</li>
          ))}
        </ol>
        {/* Visible text version on phones / motion off */}
        <ol className="frame flow-only space-y-3 py-10">
          {BEATS.map((b, i) => (
            <li key={b.text} className="font-display text-[clamp(1.4rem,1rem+2vw,2.2rem)] font-bold leading-tight tracking-[-0.03em] text-fg">
              <span className="mono mr-3 align-middle text-[11px] font-normal tracking-[0.14em] text-accent-ink">0{i + 1}</span>
              {b.text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
