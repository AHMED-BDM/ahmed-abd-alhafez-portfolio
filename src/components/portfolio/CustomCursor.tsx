import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor - نسخة الـ Ultra-Smooth
 * الحل العبقري: فصل حركة العين (لحظية) عن حركة الإضاءة (سلسة)
 */
export const CustomCursor = ({ mode, showSpotlight = true }: { mode: "night" | "day"; showSpotlight?: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // إحداثيات الإضاءة (التي تلحق الماوس بسلاسة)
  const lightPos = useRef({ x: -100, y: -100 });
  // إحداثيات الماوس الحقيقية (الهدف)
  const targetPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // إخفاء المؤشر الأصلي تماماً
    document.body.style.cursor = 'none';

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      targetPos.current = { x: clientX, y: clientY };

      // عبقرية الحل: تحريك "العين" فوراً دون انتظار الـ Frame القادم
      // نستخدم الـ Ref للوصول المباشر للـ DOM لأداء خارق
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--x', `${clientX}px`);
        cursorRef.current.style.setProperty('--y', `${clientY}px`);
      }
    };

    const tick = () => {
      // تنعيم حركة الإضاءة فقط لجعلها تبدو كأنها تأثير سحري يلحق بالعين
      const ease = 0.12; 
      lightPos.current.x += (targetPos.current.x - lightPos.current.x) * ease;
      lightPos.current.y += (targetPos.current.y - lightPos.current.y) * ease;

      if (spotlightRef.current) {
        const { x, y } = lightPos.current;
        
        if (!showSpotlight && mode === "day") {
          // تأثير العاصفة الرملية
          spotlightRef.current.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(194, 155, 87, 0.1) 0%, rgba(60, 40, 10, 0.98) 100%)`;
          spotlightRef.current.style.backdropFilter = "blur(15px) saturate(1.2)";
        } else {
          // الإضاءة في الليل أو النهار
          const size = mode === "night" ? "350px" : "250px";
          const opacity = mode === "night" ? "0.15" : "0.08";
          spotlightRef.current.style.background = `radial-gradient(circle ${size} at ${x}px ${y}px, rgba(255, 230, 150, ${opacity}) 0%, transparent 80%)`;
          spotlightRef.current.style.backdropFilter = "none";
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
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
      {/* طبقة الإضاءة/العاصفة - تتحرك بنعومة (Smooth Trail) */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[999998] will-change-[background]"
        style={{ mixBlendMode: mode === "night" ? "soft-light" : "normal" }} 
      />
      
      {/* مؤشر عين حورس - يتحرك لحظياً (Zero Delay) */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[1000000] will-change-transform"
        style={{
          // استخدام CSS Variables للتحريك اللحظي فائق السرعة
          transform: `translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)`,
        }}
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 100 100" 
          className="text-primary drop-shadow-[0_0_15px_rgba(212,175,55,1)]"
        >
          {/* تصميم العين الذهبية المتوهجة */}
          <path 
            d="M10 50 Q50 10 90 50 Q50 90 10 50 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <circle cx="50" cy="50" r="14" fill="currentColor" />
          <path 
            d="M50 64 Q60 88 88 82 M50 64 Q40 88 12 82" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          <path 
            d="M25 22 Q50 12 75 22" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
        </svg>
      </div>

      {/* Force hide default cursor across the entire app */}
      <style>{`
        html, body, * { cursor: none !important; }
      `}</style>
    </>
  );
};
