import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const Arrow = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 16, height: 16, viewBox: "0 0 16 16", strokeWidth: 1.75, ...p })}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
export const ArrowUpRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 14, height: 14, viewBox: "0 0 14 14", strokeWidth: 1.6, ...p })}>
    <path d="M4 10L10 4M5 4h5v5" />
  </svg>
);
export const Play = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 22, height: 22, viewBox: "0 0 22 22", fill: "currentColor", stroke: "none", ...p })}>
    <path d="M7 4.8v12.4a.8.8 0 0 0 1.2.7l10-6.2a.8.8 0 0 0 0-1.4l-10-6.2A.8.8 0 0 0 7 4.8Z" />
  </svg>
);
export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base({ width: 18, height: 18, viewBox: "0 0 18 18", ...p })}>
    <path d="M4 4l10 10M14 4L4 14" />
  </svg>
);

/* Spec icons: each has an inner group that animates with transform/opacity only (see .ico-* in SpecsBento). */
export const IcoTarget = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8M16 3h3.5A1.5 1.5 0 0 1 21 4.5V8M21 16v3.5a1.5 1.5 0 0 1-1.5 1.5H16M8 21H4.5A1.5 1.5 0 0 1 3 19.5V16" />
    <circle className="ico-pulse" cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
);
export const IcoBolt = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 2.5v2.5M9.5 2.5h5" />
    <g className="ico-spin" style={{ transformOrigin: "12px 13px" }}>
      <path d="M12 13V8.5" />
    </g>
  </svg>
);
export const IcoSound = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" />
    <path className="ico-wave ico-wave-1" d="M15 9.5a3.5 3.5 0 0 1 0 5" />
    <path className="ico-wave ico-wave-2" d="M17.5 7a7 7 0 0 1 0 10" />
  </svg>
);
export const IcoDrive = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 13h18" />
    <circle className="ico-blink" cx="17" cy="16" r="1" fill="currentColor" stroke="none" />
    <path d="M7 16h5" />
  </svg>
);
export const IcoShield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" />
    <path className="ico-drop" d="M12 8.5c1.8 2.2 2.6 3.6 2.6 4.7a2.6 2.6 0 1 1-5.2 0c0-1.1.8-2.5 2.6-4.7z" />
  </svg>
);
export const IcoCamera = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="2.5" y="6" width="14" height="12" rx="2" />
    <path d="M16.5 10.5l5-3v9l-5-3" />
    <g className="ico-spin" style={{ transformOrigin: "9.5px 12px" }}>
      <circle cx="9.5" cy="12" r="3" />
      <path d="M9.5 9v1.2" />
    </g>
  </svg>
);
export const IcoSignal = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path className="ico-bar ico-bar-1" d="M5 19v-3" />
    <path className="ico-bar ico-bar-2" d="M10 19v-6" />
    <path className="ico-bar ico-bar-3" d="M15 19v-9" />
    <path className="ico-bar ico-bar-4" d="M20 19V7" />
  </svg>
);
export const IcoPlug = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M9 3v4M15 3v4M6.5 7h11v3.5a5.5 5.5 0 0 1-11 0z" />
    <path d="M12 16v5" />
    <path className="ico-pulse" d="M12.8 9l-2 2.6h2.4l-2 2.6" />
  </svg>
);
export const IcoThermo = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z" />
    <g className="ico-rise">
      <path d="M12 10v6" />
    </g>
    <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);
export const IcoFilter = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 5h16l-6 7.5V19l-4 1.5v-8z" />
    <path className="ico-blink" d="M17.5 15.5l3 3M20.5 15.5l-3 3" />
  </svg>
);
