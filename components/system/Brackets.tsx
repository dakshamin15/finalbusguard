import type { CSSProperties } from "react";

/** Four orange corner marks: the computer-vision bounding box that runs through the brand. */
export default function Brackets({ size = 14, inset = 0, className = "" }: { size?: number; inset?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`brackets ${className}`} style={{ "--bk": `${size}px`, inset } as CSSProperties}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}
