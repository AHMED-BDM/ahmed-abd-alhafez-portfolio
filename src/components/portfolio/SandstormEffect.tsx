import { useEffect, useRef, useState } from "react";

interface SandstormEffectProps {
  mode: "day" | "night";
}

export const SandstormEffect = ({ mode }: SandstormEffectProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (mode !== "day") return;
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {});
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  if (mode !== "day") return null;

  return (
    <>
      {/* طبقة العاصفة الرملية الخلفية */}
      <div 
        className="sandstorm-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 40,
          background: "radial-gradient(circle at center, rgba(194, 150, 70, 0.15) 0%, rgba(160, 110, 40, 0.35) 100%)",
          backdropFilter: "blur(8px) brightness(0.85) sepia(0.4)",
          mixBlendMode: "multiply",
          transition: "opacity 0.3s ease",
        }}
      />
      
      {/* نافذة الرؤية حول الماوس (كشاف) */}
      <div
        className="sandstorm-viewport"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 41,
          WebkitMaskImage: isVisible 
            ? `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 70%, black 99%)`
            : "none",
          maskImage: isVisible 
            ? `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 70%, black 99%)`
            : "none",
          WebkitMaskComposite: "source-out",
          maskComposite: "exclude",
        }}
      />
      
      {/* جزيئات الرمال المتحركة */}
      <div className="sand-particles" style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 42,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(210, 170, 80, 0.2) 1px, transparent 1px),
                          radial-gradient(circle at 80% 70%, rgba(190, 140, 60, 0.15) 1px, transparent 1px),
                          radial-gradient(circle at 40% 85%, rgba(200, 160, 70, 0.25) 1px, transparent 1px)`,
        backgroundSize: "150px 150px, 200px 200px, 100px 100px",
        animation: "sandDrift 20s linear infinite",
        opacity: 0.6,
      }} />
      
      <style>{`
        @keyframes sandDrift {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 300px 200px, 400px 300px, 200px 150px; }
        }
        
        @keyframes sandParticleFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.4; }
          100% { transform: translate(var(--dx, 100px), var(--dy, -200px)) rotate(360deg); opacity: 0; }
        }
        
        /* تحسين أداء المؤثرات */
        .sandstorm-overlay, .sandstorm-viewport, .sand-particles {
          will-change: transform, mask-position, background-position;
        }
        
        /* ضمان أن المحتوى التفاعلي لا يتأثر */
        button, a, input, textarea, [data-cursor="native"] {
          position: relative;
          z-index: 50;
        }
      `}</style>
    </>
  );
};
