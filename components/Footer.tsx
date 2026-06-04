"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/technology", label: "Technology" },
  { href: "/impact", label: "Impact" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo.png" alt="BusGuard logo" width={28} height={28} />
              <span className="font-bold text-xl heading-tight" style={{ color: "#ffffff" }}>
                Bus<span style={{ color: "#f97316" }}>Guard</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#aaaaaa" }}>
              Real-time stop-arm violation detection — in active discussions with Virginia school districts.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "#666666" }}>Navigation</h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors duration-200"
                    style={{ color: "#aaaaaa" }}
                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ffffff")}
                    onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#aaaaaa")}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4" style={{ color: "#666666" }}>Contact</h4>
            <div className="flex flex-col gap-2.5 text-sm" style={{ color: "#aaaaaa" }}>
              <a href="mailto:busguardhelp@gmail.com" className="transition-colors duration-200"
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ffffff")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#aaaaaa")}>
                busguardhelp@gmail.com
              </a>
              <span>Henrico County, VA</span>
              <Link href="/contact" className="transition-colors duration-200"
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#ffffff")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#aaaaaa")}>
                Request a Demo
              </Link>
            </div>
          </div>

          <div className="flex items-start">
            <p className="text-sm font-semibold leading-relaxed" style={{ color: "#f97316" }}>
              Built for safety.<br />Proven in the field.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-xs" style={{ color: "#666666" }}>© {new Date().getFullYear()} BusGuard. All rights reserved.</p>
          <p className="text-xs" style={{ color: "#555555" }}>211 controlled trials · 95.3% true positive rate</p>
        </div>
      </div>
    </footer>
  );
}
