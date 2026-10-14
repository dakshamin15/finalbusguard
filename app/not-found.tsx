import type { Metadata } from "next";
import { TransitionLink } from "@/components/system/Transition";
import GridLines from "@/components/system/GridLines";
import { Arrow } from "@/components/system/Icons";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative flex min-h-[90svh] items-center overflow-hidden pt-[var(--nav-h)]">
      <GridLines />
      <div className="frame relative">
        <div className="relative inline-block px-8 py-6">
          <span className="brackets">
            <i />
            <i />
            <i />
            <i />
          </span>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-fg-3">404 · No object detected</p>
        </div>
        <h1 tabIndex={-1} className="t-xl mt-10 max-w-[12ch] text-fg outline-none">
          Nothing to see here.
        </h1>
        <p className="t-body-l mt-6 max-w-md text-fg-2">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <TransitionLink href="/" className="btn btn-primary mt-10">
          Back to home
          <span className="btn-arrow">
            <Arrow />
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
