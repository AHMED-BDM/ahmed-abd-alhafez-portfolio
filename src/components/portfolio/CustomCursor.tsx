import { useEffect, useRef, useState } from "react";

export const CustomCursor = ({ mode, showSpotlight = true }: { mode: "night" | "day"; showSpotlight?: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const ankhRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.2;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.2;

      if (spotlightRef.current) {
        if (!showSpotlight && mode === "day") {
          // ✅ تأثير العاصفة الرملية (وليس الظلام): لون ترابي كثيف يحجب الرؤية
          spotlightRef.current.style.background = `radial-gradient(circle 200px at ${posRef.current.x}px ${posRef.current.y}px, rgba(194, 155, 87, 0.4) 0%, rgba(160, 120, 50, 0.95) 80%)`;
          spotlightRef.current.style.backdropFilter = "blur(8px) saturate(1.5)";
        } else if (mode === "night") {
          // ✅ الليل واضح مع كشاف شديد الإضاءة حول الماوس
          // استخدمنا شفافية قليلة جداً للسواد (0.15) عشان يفضل الليل واضح
          spotlightRef.current.style.background = `radial-gradient(circle 300px at ${posRef.current.x}px ${posRef.current.y}px, rgba(255, 240, 150, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%)`;
          spotlightRef.current.style.backdropFilter = "none";
        } else {
          // النهار العادي مع الكشاف
          spotlightRef.current.style.background = `radial-gradient(circle 250px at ${posRef.current.x}px ${posRef.current.y}px, rgba(212, 175, 55, 0.1) 0%, transparent 70%)`;
          spotlightRef.current.style.backdropFilter = "none";
        }
      }

      if (ankhRef.current) {
        ankhRef.current.style.left = `${posRef.current.x}px`;
        ankhRef.current.style.top = `${posRef.current.y}px`;
        ankhRef.current.style.opacity = (!showSpotlight && mode === "day") ? "0.2" : "1";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, showSpotlight]);

  if (hidden) return null;

  return (
    <>
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[99997] transition-colors duration-1000"
        style={{ 
          // في الليل نستخدم overlay عشان "ينور" الألوان الأصلية ويزود شدتها
          mixBlendMode: mode === "night" ? "soft-light" : "normal" 
        }} 
      />
      
      <div
        ref={ankhRef}
        className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{ filter: `drop-shadow(0 0 10px hsl(var(--primary)))` }}
      >
        <svg width="32" height="40" viewBox="0 0 28 36">
          <circle cx="14" cy="9" r="6.5" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary" />
          <path d="M14 16 V34 M5 22 H23" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="text-primary" />
        </svg>
      </div>
    </>
  );
};
