import { useEffect, useState } from "react";

export const CustomCursor = ({ mode }: { mode: "night" | "day" }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hidden, setHidden] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }
    document.documentElement.classList.add("has-custom-cursor");
    const move = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const next = { x: e.clientX, y: e.clientY };
      setPos(next);
      setInteractive(
        Boolean(
          target?.closest(
            "button,a,input,textarea,select,label,[role='button'],[role='dialog'],[contenteditable='true'],[data-cursor='native']"
          )
        )
      );
      setTrail((current) => [...current.slice(-4), { ...next, id: Date.now() + Math.random() }]);
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTrail((current) => current.slice(-3));
    }, 70);

    return () => window.clearInterval(interval);
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
      {trail.map((point, index) => (
        <span
          key={point.id}
          className="pointer-events-none fixed z-[68] block rounded-full bg-primary/20"
          style={{
            left: point.x,
            top: point.y,
            width: `${Math.max(4, 10 - index * 2)}px`,
            height: `${Math.max(4, 10 - index * 2)}px`,
            transform: "translate(-50%, -50%)",
            opacity: interactive ? 0 : Math.max(0.08, 0.22 - index * 0.04),
            filter: "blur(1px)",
          }}
        />
      ))}
      {/* Ankh cursor */}
      <div className="pointer-events-none fixed z-[70] -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y, transition: "transform 0.05s linear", opacity: interactive ? 0 : 1 }}>
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <circle cx="14" cy="9" r="6.5" stroke="hsl(var(--primary))" strokeWidth="2" />
          <path d="M14 16 V34 M5 22 H23" stroke="hsl(var(--primary))" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
};
