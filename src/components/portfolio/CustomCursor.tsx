import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor - مؤشر عين حورس الذهبي
 * تم ضبط الـ z-index ليكون أعلى من رسائل التحذير (1,000,000)
 * وتم تحسين تأثير العاصفة والليل ليكون أكثر واقعية وسلاسة.
 */
export const CustomCursor = ({ mode, showSpotlight = true }: { mode: "night" | "day"; showSpotlight?: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. إخفاء مؤشر الماوس الافتراضي من الصفحة بالكامل
    document.body.style.cursor = 'none';
    
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      // 2. تنعيم حركة الماوس (Interpolation) ليكون خفيفاً وسلساً
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.15;

      // 3. تحديث تأثير الإضاءة (Spotlight) أو العاصفة (Storm)
      if (spotlightRef.current) {
        if (!showSpotlight && mode === "day") {
          // حالة العاصفة الرملية: تعتيم رملي مع بلر قوي
          spotlightRef.current.style.background = `radial-gradient(circle 180px at ${posRef.current.x}px ${posRef.current.y}px, rgba(194, 155, 87, 0.1) 0%, rgba(60, 40, 10, 0.98) 100%)`;
          spotlightRef.current.style.backdropFilter = "blur(15px) saturate(1.2)";
        } else if (mode === "night") {
          // حالة الليل: إضاءة ذهبية خفيفة تزيد من وضوح العناصر تحت الماوس
          spotlightRef.current.style.background = `radial-gradient(circle 350px at ${posRef.current.x}px ${posRef.current.y}px, rgba(255, 230, 150, 0.12) 0%, rgba(0, 0, 0, 0.05) 80%)`;
          spotlightRef.current.style.backdropFilter = "none";
        } else {
          // حالة النهار العادية
          spotlightRef.current.style.background = `radial-gradient(circle 250px at ${posRef.current.x}px ${posRef.current.y}px, rgba(212, 175, 55, 0.08) 0%, transparent 75%)`;
          spotlightRef.current.style.backdropFilter = "none";
        }
      }

      // 4. تحديث موقع عين حورس (استخدام translate3d لأداء أفضل على GPU)
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
      {/* طبقة الإضاءة أو العاصفة - z-index تحت الماوس مباشرة */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[999998] transition-opacity duration-500"
        style={{ mixBlendMode: mode === "night" ? "soft-light" : "normal" }} 
      />
      
      {/* مؤشر عين حورس الذهبي - أعلى z-index في الموقع بالكامل لضمان ظهوره فوق الرسائل */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[1000000] -ml-6 -mt-6 will-change-transform"
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 100 100" 
          className="text-primary drop-shadow-[0_0_12px_rgba(212,175,55,1)]"
        >
          {/* تصميم عين حورس الفرعونية الذهبية */}
          <path 
            d="M10 50 Q50 10 90 50 Q50 90 10 50 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
          />
          <circle cx="50" cy="50" r="14" fill="currentColor" className="animate-pulse" />
          <path 
            d="M50 64 Q60 88 88 82 M50 64 Q40 88 12 82" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          <path 
            d="M25 22 Q50 12 75 22" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
          />
        </svg>
      </div>

      {/* إخفاء المؤشر الأصلي قسرياً في كل مكان لضمان عدم ظهور سهم الويندوز */}
      <style>{`
        * { cursor: none !important; }
        body, html { cursor: none !important; }
        button, a, input { cursor: none !important; }
      `}</style>
    </>
  );
};
