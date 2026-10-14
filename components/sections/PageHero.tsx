import type { CSSProperties, ReactNode } from "react";
import Words from "@/components/system/Words";
import GridLines from "@/components/system/GridLines";

type Props = { eyebrow: string; title: string; sub?: string; accent?: string[]; children?: ReactNode };

export default function PageHero({ eyebrow, title, sub, accent = [], children }: Props) {
  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+clamp(72px,12vw,160px))] md:pb-24">
      <GridLines />
      <div aria-hidden="true" className="glow -top-[30%] right-[-10%] h-[70vmin] w-[70vmin] opacity-50" />
      <div className="frame relative grid-12 gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-9">
          <p className="eyebrow signal fade-load" style={{ "--d": "0ms" } as CSSProperties}>
            {eyebrow}
          </p>
          <Words as="h1" text={title} mode="load" delay={100} tabIndex={-1} className="t-xl mt-7 text-fg outline-none" accent={accent} />
        </div>
        {sub && (
          <p className="t-body-l fade-load col-span-4 text-fg-2 text-pretty md:col-span-5 lg:col-span-5" style={{ "--d": "550ms" } as CSSProperties}>
            {sub}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
