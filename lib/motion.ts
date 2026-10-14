// Motion tokens. One source for CSS (mirrored in globals.css), Motion, and GSAP (via CustomEase).

export const bezier = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  snap: [0.2, 0, 0, 1] as const,
};

export const dur = {
  instant: 0.12,
  fast: 0.22,
  base: 0.42,
  slow: 0.72,
  reveal: 1.1,
};

export const stagger = { word: 0.06, line: 0.09, card: 0.08 };

export const spring = {
  magnetic: { stiffness: 220, damping: 18, mass: 0.4 },
  tilt: { stiffness: 180, damping: 22, mass: 0.6 },
};

export const DESKTOP_QUERY = "(min-width: 700px)";
export const MOBILE_QUERY = "(max-width: 699px)";
export const MOTION_KEY = "bg-motion";

/** True unless the visitor turned motion off with the footer toggle. Set on <html> before first paint. */
export const motionOK = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion-ok");
/** The OS asked for reduced motion: skip motion that runs on its own (smooth scroll, parallax). */
export const osReduce = () => typeof document !== "undefined" && document.documentElement.classList.contains("os-reduce");
/** Pinned, scroll-scrubbed choreography: desktop/tablet with motion allowed. */
export const pinMode = () => motionOK() && window.matchMedia(DESKTOP_QUERY).matches;

export const toCss = (b: readonly number[]) => `cubic-bezier(${b.join(", ")})`;
