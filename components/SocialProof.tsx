"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative z-10 w-full py-24" style={{ background: "#111111" }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* ── Left Box: Jim Ellis Quote ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-between rounded-[8px] p-8 md:p-10"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "2px solid #f97316",
            }}
          >
            <div>
              <svg className="mb-6 opacity-20" width="36" height="28" viewBox="0 0 36 28" fill="none">
                <path
                  d="M0 28V18C0 7.955 5.856 2.473 17.569 0L18.9 3.417C13.938 4.651 11.008 7.393 10.108 11.641H16.2V28H0ZM19.8 28V18C19.8 7.955 25.656 2.473 37.369 0L38.7 3.417C33.738 4.651 30.808 7.393 29.908 11.641H36V28H19.8Z"
                  fill="#ffffff"
                />
              </svg>

              <blockquote
                className="text-base md:text-lg font-light leading-relaxed mb-8"
                style={{ color: "#ffffff", fontStyle: "italic" }}
              >
                "What stands out about BusGuard is its prevention-first approach, alerting students in real time when a vehicle-violated stop arm can save a child's life, and the ability to track and map violations gives our district critical insight to make smarter, safer decisions about where to focus our efforts."
              </blockquote>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
              <div className="w-px h-8" style={{ background: "#f97316" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                  Jim Ellis
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#aaaaaa" }}>
                  Director of Pupil Transportation, Henrico County Public Schools
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Right Box: News Highlight ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-between rounded-[8px] p-8 md:p-10"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "2px solid #f97316",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(249, 115, 22, 0.15)",
                    color: "#f97316",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#f97316" }} />
                  As Seen On 8News
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-black mb-4" style={{ color: "#ffffff" }}>
                WRIC ABC 8News Feature
              </h3>

              <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: "#aaaaaa" }}>
                Highlighting how BusGuard’s innovative stop-arm detection technology is taking active steps to keep students safe across local school districts.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5">
              <a
                href="/impact"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-transform hover:translate-x-1"
                style={{ color: "#f97316" }}
              >
                Check out the news segment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
