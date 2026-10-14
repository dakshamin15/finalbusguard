"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Words from "@/components/system/Words";
import { getGsap } from "@/lib/gsap";
import { DESKTOP_QUERY, MOBILE_QUERY, motionOK, pinMode } from "@/lib/motion";
import type { SceneStep } from "@/lib/content";

/* Stage coordinates live in a 1600×900 viewBox; every layer shares it so they align exactly. */
const X = (v: number) => `${(v / 1600) * 100}%`;
const Y = (v: number) => `${(v / 900) * 100}%`;

const PIVOT = { x: 900, y: 500 }; // stop-arm hinge on the bus's driver side
const CAR = { x: 1050, y: 358, w: 190, h: 96 }; // detection box around the car at lock
const DEVICE = { x: 930, y: 555 }; // BusGuard unit, near the bus front
const STUDENT = { x: 1010, y: 668 };

const line = "rgba(var(--fg-rgb),0.55)";
const faint = "rgba(var(--fg-rgb),0.16)";

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function Road() {
  return (
    <Svg>
      <rect x="-1600" y="270" width="4800" height="430" fill="var(--bg-2)" />
      <rect x="-1600" y="330" width="4800" height="300" fill="var(--road)" />
      <line x1="-1600" x2="3200" y1="330" y2="330" stroke={faint} strokeWidth="2" />
      <line x1="-1600" x2="3200" y1="630" y2="630" stroke={faint} strokeWidth="2" />
      <line x1="-1600" x2="3200" y1="476" y2="476" stroke="rgba(var(--fg-rgb),0.22)" strokeWidth="2" strokeDasharray="34 26" />
      <line x1="-1600" x2="3200" y1="484" y2="484" stroke="rgba(var(--fg-rgb),0.22)" strokeWidth="2" strokeDasharray="34 26" />
      {/* curbs / sidewalks */}
      <line x1="-1600" x2="3200" y1="270" y2="270" stroke={faint} strokeWidth="1" />
      <line x1="-1600" x2="3200" y1="700" y2="700" stroke={faint} strokeWidth="1" />
      {Array.from({ length: 40 }).map((_, i) => (
        <g key={i} stroke="rgba(var(--fg-rgb),0.05)" strokeWidth="1">
          <line x1={-1600 + i * 120} x2={-1600 + i * 120} y1="270" y2="330" />
          <line x1={-1600 + i * 120} x2={-1600 + i * 120} y1="630" y2="700" />
        </g>
      ))}
    </Svg>
  );
}

function Bus({ stroke = line, glow = false }: { stroke?: string; glow?: boolean }) {
  return (
    <Svg>
      {glow && <rect x="510" y="490" width="480" height="130" rx="22" fill="none" stroke="var(--accent)" strokeWidth="10" opacity="0.18" />}
      <rect x="520" y="500" width="460" height="110" rx="16" fill="var(--surface-2)" stroke={stroke} strokeWidth="2" />
      <rect x="942" y="510" width="28" height="90" rx="6" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.8" />
      <line x1="560" x2="930" y1="555" y2="555" stroke={stroke} strokeWidth="1" opacity="0.25" />
      <rect x="610" y="525" width="56" height="30" rx="4" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
      <rect x="790" y="525" width="56" height="30" rx="4" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
      <line x1="534" x2="534" y1="512" y2="598" stroke={stroke} strokeWidth="1.2" opacity="0.5" />
      {/* mirrors */}
      <rect x="972" y="492" width="14" height="6" rx="2" fill={stroke} opacity="0.6" />
      <rect x="972" y="612" width="14" height="6" rx="2" fill={stroke} opacity="0.6" />
      {/* BusGuard unit */}
      <rect x={DEVICE.x - 14} y={DEVICE.y - 10} width="28" height="20" rx="4" fill="var(--accent)" opacity={glow ? 1 : 0.85} />
    </Svg>
  );
}

function StopArm() {
  return (
    <Svg>
      <line x1={PIVOT.x} y1={PIVOT.y} x2={PIVOT.x} y2={PIVOT.y - 86} stroke={line} strokeWidth="5" strokeLinecap="round" />
      <polygon
        points={Array.from({ length: 8 })
          .map((_, i) => {
            const a = (Math.PI / 4) * i + Math.PI / 8;
            return `${PIVOT.x + Math.cos(a) * 26},${PIVOT.y - 112 + Math.sin(a) * 26}`;
          })
          .join(" ")}
        fill="#c8372d"
        stroke="#ffffff"
        strokeWidth="3"
      />
      <text x={PIVOT.x} y={PIVOT.y - 107} textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff" style={{ fontFamily: "var(--font-archivo)", letterSpacing: "0.02em" }}>
        STOP
      </text>
      <circle cx={PIVOT.x} cy={PIVOT.y} r="6" fill="var(--surface-2)" stroke={line} strokeWidth="2" />
    </Svg>
  );
}

function Car() {
  const { x, y, w, h } = CAR;
  return (
    <Svg>
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx="18" fill="var(--surface-2)" stroke={line} strokeWidth="2" />
      <rect x={x + 44} y={y + 22} width="34" height={h - 44} rx="6" fill="none" stroke={line} strokeWidth="1.4" opacity="0.7" />
      <rect x={x + 120} y={y + 24} width="26" height={h - 48} rx="5" fill="none" stroke={line} strokeWidth="1.2" opacity="0.5" />
      {/* headlights, facing left (direction of travel) */}
      <rect x={x + 8} y={y + 20} width="6" height="14" rx="2" fill="rgba(var(--fg-rgb),0.85)" />
      <rect x={x + 8} y={y + h - 34} width="6" height="14" rx="2" fill="rgba(var(--fg-rgb),0.85)" />
      <path d={`M ${x + 6} ${y + 26} L ${x - 160} ${y - 10} L ${x - 160} ${y + h + 10} L ${x + 6} ${y + h - 26} Z`} fill="url(#beam)" opacity="0.5" />
      <defs>
        <linearGradient id="beam" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(var(--fg-rgb),0.16)" />
          <stop offset="1" stopColor="rgba(var(--fg-rgb),0)" />
        </linearGradient>
      </defs>
    </Svg>
  );
}

function Fov() {
  return (
    <Svg>
      <defs>
        <linearGradient id="fov" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(236,124,52,0.22)" />
          <stop offset="1" stopColor="rgba(236,124,52,0)" />
        </linearGradient>
      </defs>
      <path d={`M ${DEVICE.x} ${DEVICE.y - 6} L 1720 300 L 1720 500 Z`} fill="url(#fov)" />
      <line x1={DEVICE.x} y1={DEVICE.y - 6} x2="1720" y2="300" stroke="rgba(236,124,52,0.35)" strokeWidth="1" strokeDasharray="4 6" />
      <line x1={DEVICE.x} y1={DEVICE.y - 6} x2="1720" y2="500" stroke="rgba(236,124,52,0.35)" strokeWidth="1" strokeDasharray="4 6" />
    </Svg>
  );
}

function Student() {
  return (
    <Svg>
      <circle cx={STUDENT.x} cy={STUDENT.y} r="9" fill="rgba(var(--fg-rgb),0.95)" />
      <circle cx={STUDENT.x} cy={STUDENT.y} r="17" fill="none" stroke="rgba(var(--fg-rgb),0.35)" strokeWidth="1.5" />
      <text x={STUDENT.x + 28} y={STUDENT.y + 5} fontSize="14" fill="rgba(var(--fg-rgb),0.6)" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
        STUDENT
      </text>
    </Svg>
  );
}

function MapGrid() {
  const roads = [
    "M -200 260 L 1800 300",
    "M -200 620 L 1800 560",
    "M 300 -100 L 360 1000",
    "M 1180 -100 L 1120 1000",
    "M -200 900 L 900 -100",
    "M 760 1000 L 1800 120",
  ];
  const minor: string[] = [];
  for (let i = 0; i < 18; i++) minor.push(`M ${-100 + i * 100} -100 L ${-60 + i * 100} 1000`);
  for (let i = 0; i < 11; i++) minor.push(`M -200 ${-40 + i * 95} L 1800 ${-10 + i * 95}`);
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      {minor.map((d, i) => (
        <path key={`m${i}`} d={d} stroke="rgba(var(--fg-rgb),0.05)" strokeWidth="1" fill="none" />
      ))}
      {roads.map((d, i) => (
        <path key={i} d={d} stroke="rgba(var(--fg-rgb),0.13)" strokeWidth="6" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function IncidentCard({ className = "" }: { className?: string }) {
  const rows = [
    { k: "Timestamp", v: "07:42:18.204" },
    { k: "GPS", v: "37.60° N, 77.51° W" },
    { k: "Image capture", v: "Frame saved" },
    { k: "Route ID", v: "R-14" },
  ];
  return (
    <div className={`card w-full max-w-[360px] p-5 backdrop-blur-md ${className}`} style={{ background: "rgba(var(--surface-rgb),0.92)" }}>
      <div className="flex items-center justify-between">
        <p className="eyebrow flex items-center gap-2 !text-fg">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Incident logged
        </p>
        <span className="mono rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-fg-3 shadow-[inset_0_0_0_1px_var(--line-2)]">Illustrative</span>
      </div>
      <dl className="mt-4 divide-y divide-[var(--line)]">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between py-2.5 text-[13px]">
            <dt className="text-fg-3">{r.k}</dt>
            <dd className="mono text-fg">{r.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mono mt-3 text-[10.5px] uppercase tracking-[0.12em] text-fg-3">Written to 256 GB onboard storage</p>
    </div>
  );
}

type Props = {
  steps: SceneStep[];
  /** Progress at which each step becomes active. */
  activeAt?: number[];
  eyebrow?: string;
  title?: string;
  id?: string;
};

export default function ViolationScene({
  steps,
  activeAt = [0.2, 0.5, 0.76],
  eyebrow = "How it works",
  title = "Two hundred milliseconds, slowed down.",
  id = "how",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const q = (sel: string) => root.current?.querySelector<HTMLElement>(`[data-l="${sel}"]`) ?? null;
  const qa = (sel: string) => Array.from(root.current?.querySelectorAll<HTMLElement>(`[data-l="${sel}"]`) ?? []);

  useEffect(() => {
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();

    // Desktop: fully scrubbed, pinned narrative.
    mm.add(DESKTOP_QUERY, () => {
      if (!pinMode()) return;
      const readout = q("readout");
      const fill = q("fill");
      const head = q("head");
      const railW = () => fill?.parentElement?.offsetWidth ?? 0;
      const stepEls = qa("step");

      gsap.set(q("arm"), { rotate: -90 });
      gsap.set(q("fov"), { autoAlpha: 0 });
      gsap.set(q("car"), { xPercent: 62 });
      gsap.set(q("box"), { scale: 2.4, autoAlpha: 0 });
      gsap.set(q("tag"), { autoAlpha: 0, y: 10 });
      gsap.set(q("scan"), { autoAlpha: 0, xPercent: 0 });
      gsap.set(qa("ring"), { scale: 0.2, autoAlpha: 0 });
      gsap.set(q("hot"), { autoAlpha: 0 });
      gsap.set(q("bloom"), { autoAlpha: 0 });
      gsap.set(q("sring"), { scale: 0.6, autoAlpha: 0 });
      gsap.set(q("map"), { autoAlpha: 0, scale: 1.25 });
      gsap.set(q("tile"), { autoAlpha: 0 });
      gsap.set(q("pin"), { autoAlpha: 0, y: -60, scale: 2.9 });
      gsap.set(q("card"), { autoAlpha: 0, x: 40 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (s) => {
            const p = s.progress;
            if (readout) {
              const label = p < 0.26 ? "Standby" : p < 0.4 ? "0 ms" : p < 0.52 ? "~80 ms" : p < 0.8 ? "<200 ms" : "Logged";
              if (readout.textContent !== label) readout.textContent = label;
              readout.dataset.hot = p >= 0.52 && p < 0.8 ? "1" : "0";
            }
            const r = Math.min(1, Math.max(0, (p - 0.26) / (0.6 - 0.26)));
            if (fill) fill.style.transform = `scaleX(${r})`;
            const dot = q("dot");
            if (dot) dot.style.transform = `translateX(${r * railW()}px)`;
            stepEls.forEach((el, i) => {
              const on = p >= activeAt[i] && (i === stepEls.length - 1 || p < activeAt[i + 1]);
              el.dataset.active = on ? "1" : "0";
            });
          },
        },
      });

      tl.to(head, { autoAlpha: 1, duration: 0.001 }, 0)
        .to(q("arm"), { rotate: 0, ease: "bg.snap", duration: 0.08 }, 0.02)
        .to(q("fov"), { autoAlpha: 1, duration: 0.06 }, 0.05)
        .to(q("car"), { xPercent: 0, ease: "power2.out", duration: 0.2 }, 0.1)
        .to(q("box"), { scale: 1, autoAlpha: 1, ease: "bg.snap", duration: 0.08 }, 0.26)
        .to(q("tag"), { autoAlpha: 1, y: 0, duration: 0.04 }, 0.32)
        .to(q("scan"), { autoAlpha: 1, duration: 0.02 }, 0.37)
        .to(q("scan"), { xPercent: 100, ease: "bg.inOut", duration: 0.12 }, 0.37)
        .to(q("scan"), { autoAlpha: 0, duration: 0.02 }, 0.49)
        .to(q("hot"), { autoAlpha: 1, duration: 0.04 }, 0.52)
        .to(q("bloom"), { autoAlpha: 1, duration: 0.05 }, 0.52)
        .to(q("bloom"), { autoAlpha: 0.35, duration: 0.12 }, 0.58)
        .to(q("car"), { xPercent: -3, ease: "power2.out", duration: 0.1 }, 0.53);
      qa("ring").forEach((ring, i) => {
        tl.to(ring, { autoAlpha: 0.9, scale: 0.2, duration: 0.001 }, 0.52 + i * 0.045).to(
          ring,
          { scale: 4.2, autoAlpha: 0, ease: "power1.out", duration: 0.16 },
          0.52 + i * 0.045
        );
      });
      tl.to(q("sring"), { scale: 1, autoAlpha: 1, ease: "bg.snap", duration: 0.05 }, 0.56)
        // Log: the frame becomes an image capture and drops onto the map.
        .to(q("map"), { autoAlpha: 1, scale: 1, ease: "bg.inOut", duration: 0.16 }, 0.78)
        .to(q("tile"), { autoAlpha: 1, duration: 0.04 }, 0.78)
        .set(q("clip"), { overflow: "hidden" }, 0.785)
        .to(q("stage"), { scale: 0.36, xPercent: -24, yPercent: -2, ease: "bg.inOut", duration: 0.16 }, 0.78)
        .to(q("bloom"), { autoAlpha: 0, duration: 0.06 }, 0.78)
        .to(q("pin"), { autoAlpha: 1, y: 0, ease: "back.out(2)", duration: 0.06 }, 0.9)
        .to(q("card"), { autoAlpha: 1, x: 0, ease: "bg.out", duration: 0.08 }, 0.88)
        .to({}, { duration: 0.04 }, 0.96);
    });

    // Mobile: a light one-shot vignette when the stage scrolls into view.
    mm.add(MOBILE_QUERY, () => {
      if (!motionOK()) return;
      const tl = gsap.timeline({ paused: true, defaults: { ease: "bg.out" } });
      tl.from(q("arm"), { rotate: -90, duration: 0.5, ease: "bg.snap" })
        .from(q("car"), { xPercent: 62, duration: 0.9, ease: "power2.out" }, 0.2)
        .from(q("box"), { scale: 2.4, autoAlpha: 0, duration: 0.45, ease: "bg.snap" }, 0.95)
        .from(q("hot"), { autoAlpha: 0, duration: 0.3 }, 1.35);
      qa("ring").forEach((ring, i) => tl.fromTo(ring, { scale: 0.2, autoAlpha: 0.9 }, { scale: 4, autoAlpha: 0, duration: 1.2, ease: "power1.out" }, 1.35 + i * 0.18));
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            tl.play();
            io.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      const st = q("stage");
      if (st) io.observe(st);
      return () => io.disconnect();
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id={id} ref={root} aria-labelledby={`${id}-title`} className="track relative scroll-mt-0" style={{ "--track": "520svh" } as CSSProperties}>
      <div className="stick relative flex flex-col">
        {/* Map backdrop (appears in the Log beat) */}
        <div data-l="map" aria-hidden="true" className="pin-only pointer-events-none absolute inset-0 opacity-0">
          <MapGrid />
          <div className="absolute inset-0" style={{ background: "radial-gradient(70% 70% at 40% 50%, transparent, var(--bg) 85%)" }} />
        </div>

        {/* Header */}
        <div className="frame relative z-10 pt-24 md:pt-[calc(var(--nav-h)+32px)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow signal">{eyebrow}</p>
              <Words as="h2" id={`${id}-title`} text={title} className="t-m mt-5 max-w-[16ch] text-fg md:max-w-none" />
            </div>
            <div data-l="head" className="pin-only w-[9.5rem] shrink-0 text-right" aria-hidden="true">
              <p className="mono text-[10.5px] uppercase tracking-[0.16em] text-fg-3">Elapsed</p>
              <p
                data-l="readout"
                className="font-display mt-1 whitespace-nowrap text-[clamp(1.8rem,1rem+2vw,3rem)] font-bold leading-none tracking-[-0.04em] text-fg transition-colors duration-300 data-[hot='1']:text-accent"
                style={{ fontStretch: "85%" }}
              >
                Standby
              </p>
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="relative z-0 flex items-center justify-center overflow-hidden py-8 md:overflow-visible [.motion-ok_&]:md:absolute [.motion-ok_&]:md:inset-0 [.motion-ok_&]:md:py-0">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div data-l="bloom" className="absolute left-1/2 top-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 md:opacity-0" style={{ background: "radial-gradient(closest-side, rgba(236,124,52,0.22), transparent)" }} />
          </div>
          <div
            data-l="stage"
            role="img"
            aria-label="Illustration: a school bus extends its stop arm, an approaching car is detected and boxed, an orange alert pulse ripples outward from the bus, and the incident is logged to a map."
            className="relative aspect-[16/9] w-[160%] max-w-none shrink-0 will-change-transform md:w-full [.motion-ok_&]:md:w-[min(100vw,calc(100svh*1.62))]"
          >
            <div data-l="tile" className="pointer-events-none absolute -inset-3 rounded-[28px] opacity-0 shadow-[inset_0_0_0_2px_var(--line-2)]" style={{ background: "rgba(var(--bg-rgb),0.4)" }} />
            <div data-l="clip" className="absolute inset-0 overflow-hidden rounded-[18px] [.motion-ok_&]:md:overflow-visible">
              <div className="absolute inset-0"><Road /></div>
              <div data-l="fov" className="absolute inset-0"><Fov /></div>
              <div className="absolute inset-0"><Student /></div>
              <div data-l="sring" className="absolute rounded-full border-2 border-accent opacity-0" style={{ left: X(STUDENT.x), top: Y(STUDENT.y), width: "3.4%", aspectRatio: "1", translate: "-50% -50%" }} />
              <div className="absolute inset-0"><Bus /></div>
              <div data-l="hot" className="absolute inset-0"><Bus stroke="var(--accent)" glow /></div>
              <div data-l="arm" className="absolute inset-0" style={{ transformOrigin: `${X(PIVOT.x)} ${Y(PIVOT.y)}` }}><StopArm /></div>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  data-l="ring"
                  className="absolute rounded-full border-2 border-accent opacity-0"
                  style={{ left: X(DEVICE.x), top: Y(DEVICE.y), width: "16%", aspectRatio: "1", translate: "-50% -50%" }}
                />
              ))}
              <div data-l="car" className="absolute inset-0">
                <Car />
                {/* Detection box */}
                <div data-l="box" className="absolute" style={{ left: X(CAR.x), top: Y(CAR.y), width: X(CAR.w), height: Y(CAR.h) }}>
                  <span className="brackets" style={{ "--bk": "18%" } as CSSProperties}>
                    <i style={{ width: "16%", height: "34%", borderWidth: 0, borderTopWidth: 2.5, borderLeftWidth: 2.5 }} />
                    <i style={{ width: "16%", height: "34%", borderWidth: 0, borderTopWidth: 2.5, borderRightWidth: 2.5 }} />
                    <i style={{ width: "16%", height: "34%", borderWidth: 0, borderBottomWidth: 2.5, borderLeftWidth: 2.5 }} />
                    <i style={{ width: "16%", height: "34%", borderWidth: 0, borderBottomWidth: 2.5, borderRightWidth: 2.5 }} />
                  </span>
                  <div data-l="tag" className="mono absolute bottom-full left-0 mb-2 whitespace-nowrap rounded-[4px] bg-accent px-1.5 py-0.5 text-[clamp(8px,0.8vw,11px)] font-medium uppercase tracking-[0.08em] text-ink">
                    Vehicle · Stop arm extended
                  </div>
                  <div className="absolute inset-0 overflow-hidden">
                    <div data-l="scan" className="absolute inset-y-0 left-0 w-full opacity-0">
                      <span className="absolute inset-y-0 left-0 w-[2px] bg-accent" style={{ boxShadow: "0 0 18px 4px rgba(236,124,52,0.6)" }} />
                    </div>
                  </div>
                </div>
                </div>
              {/* Pin (Log beat). Counter-scaled so it reads at full size on the shrunken tile. */}
              <div data-l="pin" className="pointer-events-none absolute opacity-0" style={{ left: X(DEVICE.x - 180), top: Y(DEVICE.y - 20) }}>
                <svg width="28" height="38" viewBox="0 0 28 38" className="-translate-x-1/2 -translate-y-full" aria-hidden="true">
                  <path d="M14 37C14 37 27 22.5 27 13.5A13 13 0 0 0 1 13.5C1 22.5 14 37 14 37Z" fill="var(--accent)" />
                  <circle cx="14" cy="13.5" r="5" fill="var(--ink)" />
                </svg>
              </div>
            </div>
          </div>
          <div data-l="card" className="pin-only absolute right-[var(--gutter)] top-1/2 z-10 w-[min(360px,32vw)] -translate-y-1/2 opacity-0">
            <IncidentCard />
          </div>
        </div>

        <div className="pin-only flex-1" aria-hidden="true" />

        {/* Timeline rail + steps */}
        <div className="frame relative z-10 pb-8 md:pb-10">
          <div aria-hidden="true" className="pin-only pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10" style={{ background: "linear-gradient(to bottom, transparent, var(--bg) 45%)" }} />
          <div aria-hidden="true" className="pin-only relative mb-6">
            <div className="relative h-px bg-line-2">
              <span data-l="fill" className="absolute inset-0 origin-left scale-x-0 bg-accent" />
              <span data-l="dot" className="absolute -top-[5px] left-0 block h-[11px] w-[11px] -translate-x-1/2 rounded-full border-2 border-accent bg-bg" />
            </div>
            <div className="mono mt-3 flex justify-between text-[10.5px] uppercase tracking-[0.14em] text-fg-3">
              <span>0 ms · Detect</span>
              <span className="absolute left-[40%] -translate-x-1/2">~80 ms · Analyze</span>
              <span>&lt;200 ms · Alert</span>
            </div>
          </div>
          <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <li
                key={s.tag}
                data-l="step"
                data-active="1"
                className="group relative border-t border-line pt-5 transition-opacity duration-500 [.motion-ok_&]:md:data-[active='0']:opacity-[0.35]"
              >
                <span className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out [.motion-ok_&]:md:group-data-[active='1']:scale-x-100" aria-hidden="true" />
                <p className="mono flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-fg-3">
                  <span className="text-accent-ink">0{i + 1}</span>
                  <span className="text-fg">{s.tag}</span>
                  <span className="ml-auto">{s.ms}</span>
                </p>
                <h3 className="t-title mt-3 text-fg">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2 text-pretty">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="flow-only mt-8">
            <IncidentCard />
          </div>
        </div>
      </div>
    </section>
  );
}
