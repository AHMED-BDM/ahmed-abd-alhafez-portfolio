import { useEffect, useRef, useState } from "react";

export const CustomCursor = ({ mode, showSpotlight = true }: { mode: "night" | "day"; showSpotlight?: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // إخفاء مؤشر الماوس الأصلي من المتصفح نهائياً
    document.body.style.cursor = 'none';
    const allButtons = document.querySelectorAll('button, a');
    allButtons.forEach(el => (el as HTMLElement).style.cursor = 'none');

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      // تنعيم الحركة (كل ما قل الرقم 0.15 كل ما زادت النعومة والخفة)
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

      if (spotlightRef.current) {
        if (!showSpotlight && mode === "day") {
          spotlightRef.current.style.background = `radial-gradient(circle 150px at ${posRef.current.x}px ${posRef.current.y}px, rgba(194, 155, 87, 0.2) 0%, rgba(100, 70, 20, 0.98) 100%)`;
          spotlightRef.current.style.backdropFilter = "blur(12px)";
        } else {
          const size = mode === "night" ? "350px" : "250px";
          const opacity = mode === "night" ? "0.1" : "0.05";
          spotlightRef.current.style.background = `radial-gradient(circle ${size} at ${posRef.current.x}px ${posRef.current.y}px, rgba(255, 220, 100, ${opacity}) 0%, transparent 80%)`;
          spotlightRef.current.style.backdropFilter = "none";
        }
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      document.body.style.cursor = 'default';
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode, showSpotlight]);

  if (hidden) return null;

  return (
    <>
      {/* طبقة الإضاءة أو العاصفة */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-500"
        style={{ mixBlendMode: mode === "night" ? "plus-lighter" : "normal" }} 
      />
      
      {/* مؤشر عين حورس الذهبي */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] -ml-5 -mt-5 will-change-transform"
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 100 100" 
          className="text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
        >
          {/* رسمة عين حورس فرعونية مبسطة */}
          <path 
            d="M10 50 Q50 10 90 50 Q50 90 10 50 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
          />
          <circle cx="50" cy="50" r="12" fill="currentColor" />
          <path 
            d="M50 62 Q60 85 85 80 M50 62 Q40 85 15 80" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <path 
            d="M30 25 Q50 15 70 25" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
          />
        </svg>
      </div>

      {/* كود CSS لضمان اختفاء الماوس في كل مكان */}
      <style>{`
        * { cursor: none !important; }
      `}</style>
    </>
  );
};
