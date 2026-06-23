"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Avyay Bharadwaj",
    role: "Co-Founder",
    photo: "/avyay.png",
    bio: "Leads day-to-day operations, pitches, and go-to-market strategy. Responsible for pitch strategy and external communications.",
  },
  {
    name: "Daksh Amin",
    role: "Co-Founder",
    photo: "/daksh.png",
    bio: "Drives BusGuard's brand, outreach, and partnerships. Keeps the team moving and connected with connections and supporting businesses.",
  },
  {
    name: "Kshiteej Herode",
    role: "Co-Founder",
    photo: "/kshiteej.png",
    bio: "Leads the computer vision model, hardware integration, and software architecture. The technical backbone of the BusGuard system.",
  },
];

const values = [
  {
    title: "Safety First",
    description:
      "Every engineering decision is made with one question: does this make students safer? We never trade safety for cost.",
  },
  {
    title: "Evidence-Based",
    description:
      "We don't ship claims we can't back up. Our 95.3% accuracy figure comes from 211 real-world trials, not lab conditions.",
  },
  {
    title: "Partner-Driven",
    description:
      "We build alongside districts, drivers, and transportation directors , not in isolation. Their feedback shapes every version.",
  },
];

export default function AboutPage() {
  const missionRef  = useRef(null);
  const foundersRef = useRef(null);
  const valuesRef   = useRef(null);
  const missionIn   = useInView(missionRef,  { once: true, margin: "-80px" });
  const foundersIn  = useInView(foundersRef, { once: true, margin: "-80px" });
  const valuesIn    = useInView(valuesRef,   { once: true, margin: "-80px" });

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative pt-44 pb-28 px-6 overflow-hidden"
        style={{
          background: "#f2f2ef",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.11) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 55% 45% at 50% -5%, rgba(249,115,22,0.13) 0%, transparent 70%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[860px] mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>About</span>
            <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
          </div>
          <h1
            className="font-black heading-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#111111", lineHeight: 1.0 }}
          >
            Why We Built<br />
            <span style={{ color: "#f97316" }}>BusGuard.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#555555" }}>
            Every school day, students cross roads in front of buses while other
            vehicles illegally run stop arms. BusGuard exists to end that.
          </p>
        </motion.div>
      </section>

      {/* ── MISSION QUOTE ─────────────────────────────────────────── */}
      <section
        ref={missionRef}
        className="relative py-24 px-6 overflow-hidden"
        style={{ background: "#111111" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative z-10 max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={missionIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65 }}
          >
            <svg className="mb-8" style={{ opacity: 0.18 }} width="40" height="32" viewBox="0 0 36 28" fill="none">
              <path d="M0 28V18C0 7.955 5.856 2.473 17.569 0L18.9 3.417C13.938 4.651 11.008 7.393 10.108 11.641H16.2V28H0ZM19.8 28V18C19.8 7.955 25.656 2.473 37.369 0L38.7 3.417C33.738 4.651 30.808 7.393 29.908 11.641H36V28H19.8Z" fill="#ffffff" />
            </svg>
            <blockquote
              className="font-light leading-relaxed mb-10"
              style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)", color: "#ffffff", fontStyle: "italic" }}
            >
              "A child waiting for their school bus should never have to worry about whether
              the car behind them will stop. Technology can solve that."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-px h-8" style={{ background: "#f97316" }} />
              <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                The BusGuard Team
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOUNDERS ──────────────────────────────────────────────── */}
      <section
        ref={foundersRef}
        className="relative py-28 px-6"
        style={{ background: "#ffffff" }}
      >
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={foundersIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>The Team</span>
              <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
            </div>
            <h2
              className="font-black heading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111111" }}
            >
              The co-founders.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 32 }}
                animate={foundersIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="rounded-[10px] overflow-hidden group"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(249,115,22,0.45)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,0,0,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden" style={{ background: "#f2f2ef" }}>
                  <Image src={f.photo} alt={f.name} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
                  {/* orange bottom bar on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#f97316", opacity: 0.7 }} />
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "#f97316" }}>
                    {f.role}
                  </p>
                  <h3 className="text-xl font-black heading-tight mb-3" style={{ color: "#111111" }}>{f.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{f.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────── */}
      <section
        ref={valuesRef}
        className="relative py-28 px-6 overflow-hidden"
        style={{
          background: "#f2f2ef",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.10) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      >
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#f97316" }}>Our Values</span>
              <div className="flex-1 h-px" style={{ background: "rgba(249,115,22,0.25)" }} />
            </div>
            <h2
              className="font-black heading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111111" }}
            >
              What drives us.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 28 }}
                animate={valuesIn ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="rounded-[10px] p-8"
                style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <div className="w-8 h-1 rounded-full mb-6" style={{ background: "#f97316" }} />
                <h3 className="text-lg font-black heading-tight mb-3" style={{ color: "#111111" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
