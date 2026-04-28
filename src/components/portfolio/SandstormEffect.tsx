import { useEffect, useState, useMemo } from "react";

export const SandstormEffect = ({ mode }: { mode: "day" | "night" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const particles = useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      duration: 0.5 + Math.random() * 1,
      delay: Math.random() * 2,
      size: 1 + Math.random() * 3 + "px",
      opacity: 0.1 + Math.random() * 0.5
    })), []);

  useEffect(() => {
    if (mode === "day") {
      const timer = setTimeout(() => setIsActive(true), 100);
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(timer);
      };
    } else {
      setIsActive(false);
    }
  }, [mode]);

  if (mode !== "day") return null;

  return (
    <>
      {/* 1. القاعدة الأساسية */}
      <div 
        className={`fixed inset-0 z-[40] pointer-events-none transition-opacity duration-[2000ms] ${isActive ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: "rgba(160, 110, 50, 0.2)", backdropFilter: "sepia(0.5) saturate(1.2)" }} 
      />

      {/* 2. طبقة الرياح */}
      <div className="fixed inset-0 z-[41] pointer-events-none overflow-hidden opacity-40">
        {particles.map(p => (
          <div key={p.id} className="absolute bg-[#ffe4b5] animate-sand-streak"
               style={{
                 top: p.top,
                 left: p.left,
                 width: "60px",
                 height: "1px",
                 opacity: p.opacity,
                 animationDuration: p.duration + "s",
                 animationDelay: p.delay + "s"
               }} />
        ))}
      </div>

      {/* 3. العاصفة الكثيفة والقناع */}
      <div
        className="fixed inset-0 z-[50] pointer-events-none transition-opacity duration-[1500ms]"
        style={{
          opacity: isActive ? 1 : 0,
          background: "rgba(140, 90, 40, 0.85)",
          backdropFilter: "blur(8px) contrast(1.1)",
          WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.3) 45%, black 100%)`,
          maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.3) 45%, black 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none text-[20vw] font-bold text-amber-900">
           DANGER
        </div>
      </div>

      {/* 4. توهج الكشاف */}
      <div
        className="fixed pointer-events-none z-[51] transition-opacity duration-[700ms]"
        style={{
          opacity: isActive ? 1 : 0,
          left: mousePos.x - 250,
          top: mousePos.y - 250,
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(255, 200, 100, 0.15) 0%, rgba(210, 140, 50, 0.05) 40%, transparent 70%)`,
          mixBlendMode: "screen"
        }}
      />

      {/* 5. حبيبات الرمل */}
      <div className="fixed inset-0 z-[52] pointer-events-none opacity-[0.15] animate-grain bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />

      <style>{`
        @keyframes sand-streak {
          0% { transform: translateX(100vw) translateY(0); }
          100% { transform: translateX(-100vw) translateY(20px); }
        }
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-1%, -1%); }
        }
        .animate-sand-streak { animation: sand-streak linear infinite; }
        .animate-grain { animation: grain 0.1s steps(2) infinite; }
        
        body::after {
          content: "";
          position: fixed;
          inset: 0;
          box-shadow: inset 0 0 150px rgba(180, 120, 50, 0.4);
          pointer-events: none;
          z-index: 53;
        }
      `}</style>
    </>
  );
};
