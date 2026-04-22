import { useEffect, useState } from "react";

export const CustomCursor = ({ mode }: { mode: "night" | "day" }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }
    document.documentElement.classList.add("has-custom-cursor");
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Spotlight (flashlight at night, sun beam in day) */}
      <div className="pointer-events-none fixed inset-0 z-[60]" style={{
        background: mode === "night"
          ? `radial-gradient(circle 220px at ${pos.x}px ${pos.y}px, transparent 0%, hsl(var(--background)/0.55) 70%)`
          : `radial-gradient(circle 280px at ${pos.x}px ${pos.y}px, hsl(var(--primary-glow)/0.18) 0%, transparent 60%)`,
        transition: "background 0.05s linear",
        mixBlendMode: mode === "night" ? "multiply" : "screen",
      }} />
      {/* Ankh cursor */}
      <div className="pointer-events-none fixed z-[70] -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y, transition: "transform 0.05s linear" }}>
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <circle cx="14" cy="9" r="6.5" stroke="hsl(var(--primary))" strokeWidth="2" />
          <path d="M14 16 V34 M5 22 H23" stroke="hsl(var(--primary))" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
};
