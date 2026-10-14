import { createElement, type CSSProperties, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "load" animates on mount (hero headlines); "view" waits for the RevealObserver. */
  mode?: "load" | "view";
  delay?: number;
  step?: number;
  /** Words (exact match, punctuation stripped) to tint with the accent. */
  accent?: string[];
  id?: string;
  tabIndex?: number;
};

/** Masked word-by-word slide-up. Server-rendered, so text is in the HTML and there is no layout shift. */
export default function Words({ text, as = "span", className, mode = "view", delay = 0, step = 60, accent = [], id, tabIndex }: Props) {
  const words = text.split(" ");
  const style = { "--d": `${delay}ms`, "--step": `${step}ms` } as CSSProperties;
  const children = words.map((w, i) => {
    const clean = w.replace(/[^\w%]/g, "");
    const hot = accent.includes(clean);
    return (
      <span key={i}>
        <span className="rw">
          <span style={{ "--i": i } as CSSProperties} className={hot ? "text-accent" : undefined}>
            {w}
          </span>
        </span>
        {i < words.length - 1 ? " " : null}
      </span>
    );
  });

  return createElement(
    as,
    {
      id,
      tabIndex,
      className: [className, mode === "load" ? "rw-load" : ""].filter(Boolean).join(" "),
      style,
      "data-reveal": mode === "view" ? "words" : undefined,
    },
    children
  );
}
