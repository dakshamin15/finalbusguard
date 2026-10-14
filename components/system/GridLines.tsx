/** Faint column hairlines aligned to the 12/8/4 grid, so the alignment reads as intentional. */
export default function GridLines({ className = "" }: { className?: string }) {
  const c = "rgba(var(--fg-rgb),0.045)";
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="frame h-full">
        <div className="grid-12 h-full border-r" style={{ borderColor: c }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-full border-l ${i >= 8 ? "hidden lg:block" : i >= 4 ? "hidden md:block" : ""}`} style={{ borderColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
