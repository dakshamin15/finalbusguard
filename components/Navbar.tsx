"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/technology", label: "Technology" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="BusGuard" width={38} height={38} priority style={{ width: 38, height: 38, display: "block" }} />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#666666" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#111111")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#666666")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{ border: "1px solid rgba(0,0,0,0.18)", color: "#111111" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.35)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.18)")}
          >
            Contact Sales
          </Link>
          <Link
            href="/contact"
            className="text-sm px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200"
            style={{ backgroundColor: "#f97316" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#ea6c0a")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#f97316")}
          >
            Get a Demo
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: "#111111" }}
        >
          <div className="flex flex-col gap-1.5">
            <span className="block w-6 h-0.5 bg-current transition-transform duration-200"
              style={{ transform: menuOpen ? "rotate(45deg) translateY(8px)" : "none" }} />
            <span className="block w-6 h-0.5 bg-current transition-opacity duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-0.5 bg-current transition-transform duration-200"
              style={{ transform: menuOpen ? "rotate(-45deg) translateY(-8px)" : "none" }} />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-6 py-4 flex flex-col gap-4"
          style={{ background: "rgba(255,255,255,0.98)", borderTop: "1px solid rgba(0,0,0,0.08)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium"
              style={{ color: "#666666" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <Link href="/contact"
              className="text-sm px-4 py-2 rounded-lg text-center font-medium"
              style={{ border: "1px solid rgba(0,0,0,0.18)", color: "#111111" }}
              onClick={() => setMenuOpen(false)}>
              Contact Sales
            </Link>
            <Link href="/contact"
              className="text-sm px-4 py-2 rounded-lg font-semibold text-white text-center"
              style={{ backgroundColor: "#f97316" }}
              onClick={() => setMenuOpen(false)}>
              Get a Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
