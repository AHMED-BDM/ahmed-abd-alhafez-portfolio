import { useEffect, useRef, useState } from "react";

export const CustomCursor = ({ mode }: { mode: "night" | "day" }) => {
  const [hidden, setHidden] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  
  // استخدام useRef بدل useState لمنع إعادة التحميل (Re-render) مع كل حركة للماوس
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const interactiveRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTrailRef = useRef(0);

  // Refs للتحكم المباشر في الـ DOM
  const spotlightRef = useRef<HTMLDivElement>(null);
  const ankhRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement | null;
      interactiveRef.current = Boolean(
        target?.closest(
          "button,a,input,textarea,select,label,[role='button'],[contenteditable='true']"
        )
      );
    };

    const tick = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      
      posRef.current.x += dx * 0.35;
      posRef.current.y += dy * 0.35;

      // تحديث العناصر مباشرة في الـ DOM (GPU Accelerated)
      if (spotlightRef.current) {
        spotlightRef.current.style.background = mode === "night"
          ? `radial-gradient(circle 220px at ${posRef.current.x}px ${posRef.current.y}px, transparent 0%, hsl(var(--background)/0.55) 70%)`
          : `radial-gradient(circle 280px at ${posRef.current.x}px ${posRef.current.y}px, hsl(var(--primary-glow)/0.18) 0%, transparent 60%)`;
      }

      if (ankhRef.current) {
        ankhRef.current.style.left = `${posRef.current.x}px`;
        ankhRef.current.style.top = `${posRef.current.y}px`;
      }

      const now = performance.now();
      if (now - lastTrailRef.current > 60 && Math.hypot(dx, dy) > 4) {
        lastTrailRef.current = now;
        setTrail((current) => [...current.slice(-3), { x: posRef.current.x, y: posRef.current.y, id: now + Math.random() }]);
      }

      setInteractive(interactiveRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [mode]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTrail((current) => current.slice(-2));
    }, 120);
    return () => window.clearInterval(interval);
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* Spotlight */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[60] will-change-[background] transform-gpu" 
        style={{ mixBlendMode: mode === "night" ? "multiply" : "screen" }} 
      />
      
      {/* Trail */}
      {trail.map((point, index) => (
        <span
          key={point.id}
          className="pointer-events-none fixed z-[110] block rounded-full bg-primary/40 transform-gpu will-change-transform"
          style={{
            left: point.x,
            top: point.y,
            width: `${Math.max(4, 12 - index * 2)}px`,
            height: `${Math.max(4, 12 - index * 2)}px`,
            transform: "translate(-50%, -50%)",
            opacity: Math.max(0.1, 0.35 - index * 0.07),
            filter: "blur(1.5px)",
            boxShadow: "0 0 8px hsl(var(--primary-glow) / 0.7)",
          }}
        />
      ))}
      
      {/* Ankh cursor */}
      <div
        ref={ankhRef}
        className="pointer-events-none fixed z-[120] -translate-x-1/2 -translate-y-1/2 transform-gpu will-change-transform"
        style={{
          transform: `translate(-50%, -50%) scale(${interactive ? 1.35 : 1}) rotate(${interactive ? 8 : 0}deg)`,
          transition: "transform 0.18s ease-out",
          filter: `drop-shadow(0 0 6px hsl(var(--primary) / 0.85)) drop-shadow(0 0 14px hsl(var(--primary-glow) / 0.55))`,
        }}
      >
        <svg width="32" height="40" viewBox="0 0 28 36" fill="none">
          <circle
            cx="14" cy="9" r="6.5"
            stroke="hsl(var(--primary))" strokeWidth="2"
            fill={interactive ? "hsl(var(--primary) / 0.25)" : "transparent"}
          />
          <path d="M14 16 V34 M5 22 H23"
            stroke="hsl(var(--primary))" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="14" cy="9" r="2" fill="hsl(var(--primary-glow))" opacity={interactive ? 1 : 0.6} />
        </svg>
      </div>
    </>
  );
};
