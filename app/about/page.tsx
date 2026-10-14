"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const founders = [
  {
    name: "Avyay Bharadwaj",
    role: "Co-Founder — Operations",
    photo: "/avyay.png",
    bio: "Leads day-to-day operations, partnerships, and go-to-market strategy. Keeps the team moving and connected with district stakeholders.",
  },
  {
    name: "Daksh",
    role: "Co-Founder — Marketing",
    photo: "/daksh.png",
    bio: "Drives BusGuard's brand, outreach, and competitive positioning. Responsible for pitch strategy and external communications.",
  },
  {
    name: "Kshiteej",
    role: "Co-Founder — Technology",
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
      "We build alongside districts, drivers, and transportation directors — not in isolation. Their feedback shapes every version.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-[800px] mx-auto"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "#999999" }}>
            About
          </p>
          <h1 className="text-5xl md:text-6xl font-black heading-tight mb-6" style={{ color: "#111111" }}>
            Why We Built BusGuard
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#666666" }}>
            Every school day, students cross roads in front of buses while other
            vehicles illegally run stop arms. BusGuard exists to end that.
          </p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="relative z-10 py-14 px-6" style={{ background: "#f2f2ef" }}>
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[6px] p-10 text-center"
            style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)", borderTop: "2px solid #f97316" }}
          >
            <p className="text-xl md:text-2xl font-light leading-relaxed" style={{ color: "#111111", fontStyle: "italic" }}>
              "A child waiting for their school bus should never have to worry about whether
              the car behind them will stop. Technology can solve that."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Co-founders */}
      <section className="relative z-10 pt-16 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-5 mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#999999" }}>
              The Co-Founders
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founders.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-[6px] overflow-hidden transition-all duration-200"
                style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.borderColor = "rgba(249,115,22,0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "rgba(0,0,0,0.08)";
                }}
              >
                {/* Photo */}
                <div className="relative w-full aspect-[4/3] overflow-hidden" style={{ background: "#f2f2ef" }}>
                  <Image
                    src={f.photo}
                    alt={f.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-0.5 heading-tight" style={{ color: "#111111" }}>{f.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#f97316" }}>
                    {f.role}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{f.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative z-10 pt-4 pb-24 px-6" style={{ background: "#f2f2ef" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-5 mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#999999" }}>
              Our Values
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-[6px] p-8"
                style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
              >
                <div className="w-8 h-1 rounded mb-5" style={{ background: "#f97316" }} />
                <h3 className="text-base font-bold mb-3 heading-tight" style={{ color: "#111111" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666666" }}>{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
