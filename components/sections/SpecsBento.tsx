"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import CountUp from "@/components/system/CountUp";
import Brackets from "@/components/system/Brackets";
import Words from "@/components/system/Words";
import GridLines from "@/components/system/GridLines";
import { IcoBolt, IcoCamera, IcoDrive, IcoFilter, IcoPlug, IcoShield, IcoSignal, IcoSound, IcoTarget, IcoThermo } from "@/components/system/Icons";
import { motionOK, spring } from "@/lib/motion";

function Cell({ children, className = "", i }: { children: ReactNode; className?: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, spring.tilt);
  const sry = useSpring(ry, spring.tilt);

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    if (light.current) light.current.style.transform = `translate3d(${e.clientX - r.left - 260}px, ${e.clientY - r.top - 260}px, 0)`;
    if (!motionOK()) return;
    rx.set((0.5 - py) * 5);
    ry.set((px - 0.5) * 5);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className={className} style={{ "--i": i } as CSSProperties}>
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }}
      className="spec lock card group h-full overflow-hidden p-6 md:p-7"
    >
      <div
        ref={light}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(236,124,52,0.13), transparent)" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[20px] opacity-0 shadow-[inset_0_0_0_1px_rgba(var(--fg-rgb),0.16)] transition-opacity duration-500 group-hover:opacity-100" />
      <Brackets size={14} inset={10} />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
    </div>
  );
}

const V: CSSProperties = { fontSize: "clamp(2.5rem, 1rem + 3.5vw, 4.6rem)" };

const Label = ({ icon, children }: { icon: ReactNode; children: ReactNode }) => (
  <div className="flex items-center justify-between">
    <p className="eyebrow">{children}</p>
    <span className="text-fg-2 transition-colors duration-300 group-hover:text-accent">{icon}</span>
  </div>
);

export default function SpecsBento({ heading = true }: { heading?: boolean }) {
  return (
    <section aria-labelledby="specs-title" className="section relative">
      <GridLines className="opacity-50" />
      <div className="frame relative">
        {heading && (
          <div className="grid-12 mb-12 gap-y-6 md:mb-16">
            <div className="col-span-4 md:col-span-5 lg:col-span-6">
              <p className="eyebrow signal" data-reveal>
                Hardware
              </p>
              <Words as="h2" id="specs-title" text="Under the hood." className="t-l mt-6 text-fg" />
            </div>
            <p data-reveal className="t-body-l col-span-4 text-fg-2 text-pretty md:col-span-3 md:self-end lg:col-span-4 lg:col-start-9" style={{ "--d": "150ms" } as CSSProperties}>
              A compact, weatherproof unit that mounts inside any school bus and runs on the bus&rsquo;s own 12V power.
            </p>
          </div>
        )}
        {!heading && <h2 id="specs-title" className="sr-only">Hardware specifications</h2>}

        <div data-reveal="stagger" className="grid grid-cols-1 gap-3 md:grid-cols-6 md:gap-4 lg:grid-cols-12" style={{ perspective: 1200 }}>
          <Cell i={0} className="md:col-span-6 md:row-span-2 lg:col-span-6">
            <Label icon={<IcoTarget />}>Detection</Label>
            <svg aria-hidden="true" viewBox="0 0 260 150" className="absolute right-2 top-12 hidden w-[36%] max-w-[240px] text-fg md:block" fill="none">
              <rect x="70" y="40" width="130" height="66" rx="16" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
              <rect x="96" y="52" width="24" height="42" rx="5" stroke="currentColor" strokeOpacity="0.25" />
              <rect x="152" y="54" width="20" height="38" rx="4" stroke="currentColor" strokeOpacity="0.2" />
              <path d="M70 52 L10 34 L10 112 L70 94" fill="url(#hl)" />
              <g stroke="var(--accent)" strokeWidth="2.5">
                <path d="M54 46V26h22M194 26h22v20M216 100v20h-22M76 120H54v-20" />
              </g>
              <rect x="54" y="4" width="112" height="17" rx="3" fill="var(--accent)" />
              <text x="60" y="17.5" fontSize="9" fill="var(--ink)" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>VEHICLE · LOCKED</text>
              <defs>
                <linearGradient id="hl" x1="1" x2="0" y1="0" y2="0">
                  <stop offset="0" stopColor="rgba(var(--fg-rgb),0.14)" />
                  <stop offset="1" stopColor="rgba(var(--fg-rgb),0)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-auto pt-16">
              <p className="t-stat text-fg" style={{ fontSize: "clamp(5.5rem, 3rem + 9vw, 12rem)" }}>
                <CountUp value={95.3} decimals={1} suffix="%" />
              </p>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="t-title text-fg">True positive rate</p>
                  <p className="mt-1 text-fg-2">Across 211 trials. Day, night, rain, or shine.</p>
                </div>
                <p className="mono text-[11px] uppercase tracking-[0.14em] text-fg-3">Custom CNN · proprietary dataset</p>
              </div>
            </div>
          </Cell>
          <Cell i={1} className="md:col-span-3 lg:col-span-3">
            <Label icon={<IcoBolt />}>Latency</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>&lt;200ms</p>
            <p className="mt-2 text-fg-2">Start to buzzer fired</p>
          </Cell>
          <Cell i={2} className="md:col-span-3 lg:col-span-3">
            <Label icon={<IcoSound />}>Alert</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>
              <CountUp value={100} suffix=" dB" />
            </p>
            <p className="mt-2 text-fg-2">Onboard buzzer</p>
          </Cell>
          <Cell i={3} className="md:col-span-3 lg:col-span-3">
            <Label icon={<IcoDrive />}>Storage</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>
              <CountUp value={256} suffix=" GB" />
            </p>
            <p className="mt-2 text-fg-2">Onboard, expandable</p>
          </Cell>
          <Cell i={4} className="md:col-span-3 lg:col-span-3">
            <Label icon={<IcoShield />}>Enclosure</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>IP67</p>
            <p className="mt-2 text-fg-2">Weatherproof</p>
          </Cell>
          <Cell i={5} className="md:col-span-2 lg:col-span-4">
            <Label icon={<IcoCamera />}>Camera</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>
              <CountUp value={1080} suffix="p" grouping={false} />
            </p>
            <p className="mt-2 text-fg-2">Wide-angle, WDR</p>
          </Cell>
          <Cell i={6} className="md:col-span-2 lg:col-span-4">
            <Label icon={<IcoSignal />}>Connectivity</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>4G LTE</p>
            <p className="mt-2 text-fg-2">+ WiFi sync</p>
          </Cell>
          <Cell i={7} className="md:col-span-2 lg:col-span-4">
            <Label icon={<IcoPlug />}>Power</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>
              <CountUp value={12} suffix="V" />
            </p>
            <p className="mt-2 text-fg-2">Bus electrical</p>
          </Cell>
          <Cell i={8} className="md:col-span-3 lg:col-span-6">
            <Label icon={<IcoThermo />}>Operating temp</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>&minus;20&deg;C to 60&deg;C</p>
          </Cell>
          <Cell i={9} className="md:col-span-3 lg:col-span-6">
            <Label icon={<IcoFilter />}>False positives</Label>
            <p className="t-stat-l mt-10 whitespace-nowrap text-fg" style={V}>&lt;2%</p>
            <p className="mt-2 text-fg-2">Parked cars, cyclists, and shadows filtered out</p>
          </Cell>
        </div>
      </div>
    </section>
  );
}
