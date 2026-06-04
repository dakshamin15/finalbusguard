"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Standard",
    price: "$459",
    unit: "per unit",
    description: "Perfect for individual buses or small fleets.",
    features: [
      { label: "Detection", value: "Real-time stop-arm detection" },
      { label: "Alert", value: "Audible buzzer alert system" },
      { label: "Logging", value: "Incident logging & timestamps" },
      { label: "Hardware", value: "Weatherproof enclosure" },
      { label: "Support", value: "Email, standard hours" },
      { label: "Warranty", value: "1-year hardware warranty" },
    ],
    cta: "Order Now",
    highlighted: false,
  },
  {
    name: "District",
    price: "$409",
    unit: "per unit",
    description: "Volume pricing for district-wide safety deployments.",
    features: [
      { label: "Includes", value: "Everything in Standard" },
      { label: "Dashboard", value: "Fleet management dashboard" },
      { label: "Support", value: "Priority 24/7 support" },
      { label: "Warranty", value: "3-year extended warranty" },
      { label: "Reporting", value: "District compliance reporting" },
      { label: "Integration", value: "Custom integration support" },
    ],
    cta: "Contact for Pricing",
    highlighted: true,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative z-10 pt-20 pb-28 px-6" style={{ background: "#f2f2ef" }}>
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="flex items-center gap-5 mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#999999" }}>Pricing</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.07)" }} />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <h2 className="text-3xl md:text-5xl font-black heading-tight" style={{ color: "#111111" }}>
              Simple, transparent pricing.
            </h2>
            <p className="text-sm md:text-right max-w-xs" style={{ color: "#666666" }}>
              No subscriptions. No recurring fees.<br />Lifetime firmware updates included.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-[6px] p-8 flex flex-col transition-all duration-200"
              style={{
                background: "#ffffff",
                border: plan.highlighted ? "1px solid rgba(249,115,22,0.5)" : "1px solid rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-2px)";
                el.style.borderColor = "rgba(249,115,22,0.55)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = plan.highlighted ? "rgba(249,115,22,0.5)" : "rgba(0,0,0,0.08)";
              }}
            >
              {plan.highlighted && (
                <span className="text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1 rounded-full self-start"
                  style={{ background: "rgba(249,115,22,0.10)", color: "#f97316" }}>
                  Most Popular
                </span>
              )}
              <div className="mb-7">
                <h3 className="text-lg font-bold mb-1 heading-tight" style={{ color: "#111111" }}>{plan.name}</h3>
                <p className="text-xs mb-5" style={{ color: "#666666" }}>{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black heading-tight stat-num" style={{ color: "#111111" }}>{plan.price}</span>
                  <span className="text-xs" style={{ color: "#999999" }}>{plan.unit}</span>
                </div>
              </div>
              <div className="flex flex-col flex-1 mb-8">
                {plan.features.map((f) => (
                  <div key={f.label} className="flex items-center justify-between py-2.5"
                    style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <span className="text-xs uppercase tracking-wider" style={{ color: "#999999" }}>{f.label}</span>
                    <span className="text-xs text-right" style={{ color: "#666666", maxWidth: "60%" }}>{f.value}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact"
                className="w-full py-3 rounded-lg font-semibold text-sm text-center transition-all duration-200"
                style={plan.highlighted
                  ? { background: "#f97316", color: "#ffffff" }
                  : { background: "transparent", border: "1px solid rgba(0,0,0,0.18)", color: "#111111" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (plan.highlighted) el.style.background = "#ea6c0a";
                  else el.style.borderColor = "rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  if (plan.highlighted) el.style.background = "#f97316";
                  else el.style.borderColor = "rgba(0,0,0,0.18)";
                }}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
