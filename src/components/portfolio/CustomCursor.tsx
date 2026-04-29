import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor - نسخة التوهج الذهبي الملكي (Royal Gold Glow)
 * تم تعديل الوضع الليلي ليعطي كشافاً ذهبياً متوهجاً شديد الإضاءة،
 * مع الحفاظ على الحركة اللحظية للعين والنعومة الفائقة للإضاءة.
 */
export const CustomCursor = ({ mode, showSpotlight = true }: { mode: "night" | "day"; showSpotlight?: boolean }) => {
  const [hidden, setHidden] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // إحداثيات الإضاءة (تتبع العين بنعومة)
  const lightPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // إخفاء المؤشر الأصلي قسرياً
    document.body.style.cursor = 'none';

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) { setHidden(true); return; }

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      targetPos.current = { x: clientX, y: clientY };

      // تحريك "عين حورس" لحظياً عبر متغيرات CSS لأداء خارق
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--x', `${clientX}px`);
        cursorRef.current.style.setProperty('--y', `${clientY}px`);
      }
    };

    const tick = () => {
      // تنعيم حركة الكشاف (تأثير فيزيائي جذاب)
      const ease = 0.12; 
      lightPos.current.x += (targetPos.current.x - lightPos.current.x) * ease;
      lightPos.current.y += (targetPos.current.y - lightPos.current.y) * ease;

      if (spotlightRef.current) {
        const { x, y } = lightPos.current;
        
        if (!showSpotlight && mode === "day") {
          // تأثير العاصفة الرملية الكثيفة عند الرفض
          spotlightRef.current.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(194, 155, 87, 0.1) 0%, rgba(60, 40, 10, 0.98) 100%)`;
          spotlightRef.current.style.backdropFilter = "blur(15px) saturate(1.2)";
        } else if (mode === "night") {
          // ✅ تعديل العبقرية: توهج ذهبي ملكي مكثف وساطع جداً
          // المركز ذهبي خالص فاقع، يليه ذهبي ناعم، ثم يتلاشى.
          spotlightRef.current.style.background = `radial-gradient(
            circle 350px at ${x}px ${y}px, 
            rgba(255, 215, 0, 0.6) 0%,     /* ذهبي خالص (Gold) بتركيز عالٍ في السنتر */
            rgba(234, 193, 92, 0.3) 30%,  /* ذهبي ناعم (Pharaoh Gold) */
            rgba(212, 175, 55, 0.1) 60%,  /* هالة خارجية خفيفة */
            transparent 85%               /* تلاشي تام */
          )`;
          spotlightRef.current.style.backdropFilter = "none";
        } else {
          // الوضع النهاري العادي (ذهبي خفيف جداً)
          spotlightRef.current.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, rgba(212, 175, 55, 0.15) 0%, transparent 75%)`;
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
      {/* طبقة الكشاف - تم ضبط الـ z-index والـ blend mode */}
      <div 
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-[999998] will-change-[background]"
        style={{ 
          // screen هي السر وراء جعل الألوان الذهبية المشبعة تلمع بقوة فوق الخلفيات الغامقة
          mixBlendMode: mode === "night" ? "screen" : "normal" 
        }} 
      />
      
      {/* مؤشر عين حورس - تحريك لحظي وترصيع ذهبي */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[1000000] will-change-transform"
        style={{
          // تحريك العين لحظياً باستخدام قيم CSS المتغيرة
          transform: `translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)`,
        }}
      >
        <svg 
          width="48" 
          height="48" 
          viewBox="0 0 100 100" 
          // توهج ذهبي كثيف حول العين نفسها
          className="text-primary drop-shadow-[0_0_20px_rgba(255,215,0,1)]"
        >
          {/* تصميم عين حورس الفرعونية الذهبية */}
          <path 
            d="M10 50 Q50 10 90 50 Q50 90 10 50 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <circle cx="50" cy="50" r="14" fill="currentColor" className="animate-pulse" />
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

      {/* ضمان اختفاء المؤشر الأصلي في كل مكان */}
      <style>{`
        html, body, * { cursor: none !important; }
      `}</style>
    </>
  );
};
