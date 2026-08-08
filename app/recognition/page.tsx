Here is your updated page code. A new milestone entry has been added to the top of the timeline array (dated **August 2026**) with a featured badge, description, and an external button link directly to the **WRIC ABC 8News** article.

```tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SocialProof from "@/components/SocialProof";

const ORANGE = "#E87722";

const events = [
  {
    id: "wric-news",
    date: "August 2026",
    name: "WRIC ABC 8News Feature",
    badge: "Featured on News",
    description:
      "Featured on WRIC ABC 8News highlighting how BusGuard's innovative stop-arm detection technology is taking active steps to make school buses safer in Henrico County.",
    logo: "",
    logoHeight: 0,
    photos: [],
    link: "https://www.wric.com/news/local-news/henrico-county/young-entrepreneurs-make-school-buses-safer-new-technology/",
  },
  {
    id: "henrico",
    date: "December 2025",
    name: "Henrico Innovation Challenge",
    badge: "2nd Place",
    description:
      "Earned 2nd place at Henrico County's flagship student innovation competition, recognized for technical excellence and demonstrated real-world safety impact.",
    logo: "/Henrico%20Innovation%20Challenge/Henrico-Innovation-Challenge-Logo.jpeg",
    logoHeight: 60,
    photos: [
      "/Henrico%20Innovation%20Challenge/Pitching.png",
      "/Henrico%20Innovation%20Challenge/Trifold.png",
      "/Henrico%20Innovation%20Challenge/Henrico%20Innovation%20Challenge%20Certificate.jpg",
    ],
  },
  {
    id: "diamond",
    date: "February 2026",
    name: "",
    badge: "National Semifinalists",
    description:
      "Earned a national semifinalist placement at one of the country's most competitive high school entrepreneurship competitions, hosted by Horn Entrepreneurship at the University of Delaware.",
    logo: "/Diamond/Diamond-Challenge-Logo.png",
    logoHeight: 44,
    photos: [
      "/Diamond/Avyay-Diamond.jpg",
      "/Diamond/Kshiteej-Diamond.png",
      "/Diamond/Daksh-Diamond.png",
    ],
  },
  {
    id: "blueocean",
    date: "April 2026",
    name: "",
    badge: "Top 250 Globally",
    description:
      "Ranked among the top 250 pitches worldwide, pitching BusGuard's stop-arm detection system as a market-creating solution to a decades-old safety problem.",
    logo: "/Blue%20Ocean/Blue-Ocean-Competition-Logo.png",
    logoHeight: 44,
    photos: [
      "/Blue%20Ocean/Avyay-Blue%20Ocean.png",
      "/Blue%20Ocean/Kshiteej-Blue%20Ocean.png",
      "/Blue%20Ocean/Daksh-Blue%20Ocean.png",
    ],
  },
  {
    id: "innospark",
    date: "April 2026",
    name: "Pitch Competition",
    badge: "Top 10/875 - Finalist",
    description:
      "Placed top 10 out of 875 global pitches, earning Finalist recognition for innovation and real-world impact on student transportation safety.",
    logo: "/InnoSpark/InnoSpark-Logo.avif",
    logoHeight: 56,
    photos: [
      "/InnoSpark/Avyay%20Bharadwaj%20INNOSpark%20Finalist.png",
      "/InnoSpark/Kshiteej%20Herode%20INNOSpark%20Finalist.png",
      "/InnoSpark/Daksh%20Amin%20INNOSpark%20Finalist.png",
    ],
  },
  {
    id: "vcee",
    date: "May 2026",
    name: "Lean Pitch Competition",
    badge: "Top 6 in State",
    description:
      "Ranked top 6 in Virginia at the VCEE Lean Pitch Competition, making the case for district-wide deployment of BusGuard's safety system.",
    logo: "/VCEE%20Logo.png",
    logoHeight: 90,
    photos: [],
  },
];

/* ── Lightbox ─────────────────────────────────────────────────────────── */

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,10,10,0.94)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, cursor: "zoom-out",
      }}
    >
      <motion.img
        src={src} alt=""
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "88vw", maxHeight: "88vh", objectFit: "contain", borderRadius: 10, boxShadow: "0 40px 100px rgba(0,0,0,0.7)", cursor: "default" }}
      />
      <button
        onClick={onClose} aria-label="Close"
        style={{
          position: "absolute", top: 20, right: 24,
          width: 40, height: 40, borderRadius: 999,
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
          color: "#fff", fontSize: 22, lineHeight: 1,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >×</button>
    </motion.div>
  );
}

/* ── Certificate stack (Diamond) ──────────────────────────────────────── */

function CertStack({ photos, onPhotoClick }: { photos: string[]; onPhotoClick: (s: string) => void }) {
  const rotations = [-6, 1, 5];
  const translateY = [6, 0, 4];
  const zIndexes   = [1, 3, 2];

  return (
    <div
      style={{
        background: "#F2F2EF",
        borderRadius: 10,
        padding: "20px 12px 10px",
        marginBottom: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: 190,
      }}
    >
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt=""
          onClick={() => onPhotoClick(src)}
          style={{
            width: "36%",
            borderRadius: 8,
            boxShadow: i === 1
              ? "0 10px 28px rgba(0,0,0,0.22)"
              : "0 4px 14px rgba(0,0,0,0.14)",
            transform: `rotate(${rotations[i]}deg) translateY(${translateY[i]}px)`,
            zIndex: zIndexes[i],
            position: "relative",
            marginLeft: i > 0 ? -18 : 0,
            cursor: "zoom-in",
            transition: "transform 0.3s ease",
            objectFit: "cover",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform =
              `rotate(${rotations[i]}deg) translateY(${translateY[i] - 6}px) scale(1.04)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLImageElement).style.transform =
              `rotate(${rotations[i]}deg) translateY(${translateY[i]}px)`;
          }}
        />
      ))}
    </div>
  );
}

/* ── Photo grid (non-Diamond) ─────────────────────────────────────────── */

function PhotoGrid({ photos, onPhotoClick }: { photos: string[]; onPhotoClick: (s: string) => void }) {
  if (photos.length === 3) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 8, marginBottom: 20, borderRadius: 10, overflow: "hidden", height: 260 }}>
        {/* Left: featured photo */}
        <div style={{ overflow: "hidden", cursor: "zoom-in", height: "100%" }} onClick={() => onPhotoClick(photos[0])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }} />
        </div>
        {/* Right: two stacked */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%" }}>
          {photos.slice(1).map((src, i) => (
            <div key={i} style={{ overflow: "hidden", cursor: "zoom-in", flex: 1 }} onClick={() => onPhotoClick(src)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${photos.length}, 1fr)`,
        gap: 8, marginBottom: 20, borderRadius: 10, overflow: "hidden",
      }}
    >
      {photos.map((src, i) => (
        <div key={i} style={{ overflow: "hidden", cursor: "zoom-in" }} onClick={() => onPhotoClick(src)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src} alt=""
            style={{
              width: "100%", height: 240, objectFit: "cover", display: "block",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Milestone card ───────────────────────────────────────────────────── */

function MilestoneCard({
  event,
  onPhotoClick,
  delay = 0,
}: {
  event: (typeof events)[0];
  onPhotoClick: (src: string) => void;
  delay?: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const hasPhotos = event.photos.length > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#ffffff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        padding: 24,
        overflow: "hidden",
      }}
    >
      {/* Images */}
      {hasPhotos && (event.id === "diamond" || event.id === "innospark" || event.id === "blueocean") && (
        <CertStack photos={event.photos} onPhotoClick={onPhotoClick} />
      )}
      {hasPhotos && event.id !== "diamond" && event.id !== "innospark" && event.id !== "blueocean" && (
        <PhotoGrid photos={event.photos} onPhotoClick={onPhotoClick} />
      )}

      {event.name ? (
        /* ── Named cards ── */
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start" style={{ gap: 12, marginBottom: 14 }}>
            <div style={{ minWidth: 0 }}>
              {event.logo && (
                <div style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.logo} alt={event.name}
                    style={{ height: event.logoHeight, width: "auto", objectFit: "contain", objectPosition: "left", maxWidth: 280 }}
                  />
                </div>
              )}
              <h3
                className="heading-tight"
                style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111111", lineHeight: 1.15, margin: 0 }}
              >
                {event.name}
              </h3>
            </div>

            {event.badge && (
              <span
                className="self-start"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
                  padding: "9px 18px", borderRadius: 999,
                  background: ORANGE, color: "#fff",
                  fontSize: 13, fontWeight: 800,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  boxShadow: "0 3px 14px rgba(232,119,34,0.38)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {event.badge}
              </span>
            )}
          </div>

          <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.68, margin: 0 }}>
            {event.description}
          </p>

          {event.link && (
            <div style={{ marginTop: 16 }}>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: ORANGE,
                  textDecoration: "none",
                }}
              >
                Read full article on WRIC 8News
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          )}
        </>
      ) : (
        /* ── Unnamed cards ── */
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start" style={{ gap: 12, marginBottom: 14 }}>
            {event.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.logo} alt=""
                style={{ height: event.logoHeight, width: "auto", objectFit: "contain", objectPosition: "left", maxWidth: 180, minWidth: 0 }}
              />
            )}
            {event.badge && (
              <span
                className="self-start"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
                  padding: "9px 18px", borderRadius: 999,
                  background: ORANGE, color: "#fff",
                  fontSize: 13, fontWeight: 800,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  boxShadow: "0 3px 14px rgba(232,119,34,0.38)",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {event.badge}
              </span>
            )}
          </div>

          <p style={{ fontSize: 13.5, color: "#6B7280", lineHeight: 1.68, margin: 0 }}>
            {event.description}
          </p>
        </>
      )}
    </motion.div>
  );
}

/* ── Date pill ────────────────────────────────────────────────────────── */

function DatePill({ date }: { date: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 18px",
        borderRadius: 999,
        background: "#FFF3E8",
        color: ORANGE,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {date}
    </span>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function ImpactPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerIn  = useInView(headerRef, { once: true, margin: "-60px" });
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const openPhoto  = useCallback((src: string) => setLightboxSrc(src), []);
  const closePhoto = useCallback(() => setLightboxSrc(null), []);

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
            <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: ORANGE }}>Impact</span>
            <div className="flex-1 h-px" style={{ background: "rgba(232,119,34,0.25)" }} />
          </div>
          <h1
            className="font-black heading-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#111111", lineHeight: 1.0 }}
          >
            Recognized at{" "}
            <span style={{ color: ORANGE }}>Every Stage.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-xl" style={{ color: "#555555" }}>
            From national pitch competitions to local news features. A team building
            something that matters, and proving it on every stage we step onto.
          </p>
        </motion.div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 lg:py-28 px-4 md:px-6" style={{ background: "#FAFAF8" }}>
        <div className="max-w-[1100px] mx-auto">

          {/* Header */}
          <div ref={headerRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={headerIn ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="mb-20"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: ORANGE }}>Our Journey</span>
                <div className="flex-1 h-px" style={{ background: "rgba(232,119,34,0.25)" }} />
              </div>
              <h2
                className="font-black heading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#111111" }}
              >
                From classroom to competition stage.
              </h2>
            </motion.div>
          </div>

          {/* ── Desktop ── */}
          <div className="hidden lg:block relative">
            {/* Spine */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={headerIn ? { scaleY: 1 } : {}}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 bottom-0 origin-top"
              style={{ left: "calc(50% - 1.5px)", width: 3, background: `linear-gradient(to bottom, ${ORANGE}, rgba(232,119,34,0.08))` }}
            />

            <div className="flex flex-col">
              {events.map((event, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div
                    key={event.id}
                    className="relative flex"
                    style={{ marginBottom: i < events.length - 1 ? 80 : 0 }}
                  >
                    {/* Left half */}
                    <div className="w-1/2 pr-16 flex justify-end items-start">
                      {isLeft ? (
                        <div className="w-full max-w-[460px]">
                          <MilestoneCard event={event} onPhotoClick={openPhoto} delay={i * 0.05} />
                        </div>
                      ) : (
                        <div className="flex justify-end items-center pt-5">
                          <DatePill date={event.date} />
                        </div>
                      )}
                    </div>

                    {/* Node */}
                    <div
                      className="absolute z-10"
                      style={{ left: "calc(50% - 6px)", top: 20 }}
                    >
                      <div
                        style={{
                          width: 12, height: 12, borderRadius: 999,
                          background: ORANGE,
                          border: "2.5px solid #FAFAF8",
                          boxShadow: `0 0 0 3px rgba(232,119,34,0.22), 0 2px 8px rgba(232,119,34,0.3)`,
                        }}
                      />
                    </div>

                    {/* Right half */}
                    <div className="w-1/2 pl-16 flex justify-start items-start">
                      {!isLeft ? (
                        <div className="w-full max-w-[460px]">
                          <MilestoneCard event={event} onPhotoClick={openPhoto} delay={i * 0.05} />
                        </div>
                      ) : (
                        <div className="flex justify-start items-center pt-5">
                          <DatePill date={event.date} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mobile / Tablet ── */}
          <div className="lg:hidden flex flex-col gap-10">
            {events.map((event, i) => (
              <div key={event.id} className="relative flex gap-5">
                {/* Line + node */}
                <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: 20 }}>
                  {i < events.length - 1 && (
                    <div
                      className="absolute top-6 bottom-0"
                      style={{ left: "calc(50% - 1.5px)", width: 3, background: `linear-gradient(to bottom, ${ORANGE}, rgba(232,119,34,0.1))` }}
                    />
                  )}
                  <div
                    style={{
                      width: 12, height: 12, borderRadius: 999, marginTop: 20, position: "relative", zIndex: 1, flexShrink: 0,
                      background: ORANGE, border: "2.5px solid #FAFAF8",
                      boxShadow: `0 0 0 2.5px rgba(232,119,34,0.22)`,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0" style={{ maxWidth: 600 }}>
                  <div style={{ marginBottom: 10 }}>
                    <DatePill date={event.date} />
                  </div>
                  <MilestoneCard event={event} onPhotoClick={openPhoto} delay={0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxSrc && <Lightbox src={lightboxSrc} onClose={closePhoto} />}
      </AnimatePresence>

      <SocialProof />
    </>
  );
}

```
