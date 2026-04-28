import { useEffect, useState, useMemo } from "react";

export const SandstormEffect = ({ mode }: { mode: "day" | "night" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // توليد ذرات رمل عشوائية عشان متتكررش كل رندر
  const sandGrains = useMemo(() => 
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 5
    })), []);

  useEffect(() => {
    if (mode !== "day") return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mode]);

  if (mode !== "day") return null;

  return (
    <>
      {/* 1. ذرات الرمل المتطايرة (Particles) */}
      <div className="fixed inset-0 pointer-events-none z-[53] overflow-hidden">
        {sandGrains.map((grain) => (
          <div
            key={grain.id}
            className="absolute bg-[#e3b677] rounded-full opacity-60"
            style={{
              left: `${grain.left}%`,
              top: `${grain.top}%`,
              width: `${grain.size}px`,
              height: `${grain.size}px`,
              animation: `sandFly ${grain.duration}s linear infinite`,
              animationDelay: `${grain.delay}s`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* 2. وهج الشمس الحارق (Heat Haze) */}
      <div className="fixed inset-0 pointer-events-none z-[44] opacity-30 bg-gradient-to-tr from-orange-500/20 via-transparent to-yellow-500/20 mix-blend-overlay" />

      {/* 3. طبقات الرمل الكثيفة المتحركة */}
      <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden opacity-40">
        <div className="sand-layer fast-storm" />
        <div className="sand-layer medium-storm" />
      </div>

      {/* 4. طبقة العاصفة الأساسية (الرؤية المتوسطة) */}
      <div
        className="fixed inset-0 pointer-events-none z-[50]"
        style={{
          background: "rgba(194, 155, 100, 0.65)", 
          animation: "heatDistortion 4s ease-in-out infinite",
          backdropFilter: "blur(4px) saturate(0.5) sepia(0.3)", // إضافة sepia للجو الصحراوي
          
          WebkitMaskImage: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, 
            rgba(0,0,0,0) 0%, 
            rgba(0,0,0,0.5) 50%, 
            rgba(0,0,0,0.9) 100%)`,
          maskImage: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, 
            rgba(0,0,0,0) 0%, 
            rgba(0,0,0,0.5) 50%, 
            rgba(0,0,0,0.9) 100%)`,
        }}
      />

      {/* 5. الكشاف التفاعلي */}
      <div
        className="fixed pointer-events-none z-[51] w-[350px] h-[350px] rounded-full"
        style={{
          left: mousePos.x - 175,
          top: mousePos.y - 175,
          background: "radial-gradient(circle, rgba(255, 240, 200, 0.2) 0%, transparent 80%)",
          boxShadow: "0 0 50px rgba(210, 160, 80, 0.3)",
          mixBlendMode: "soft-light"
        }}
      />

      <style>{`
        .sand-layer {
          position: absolute;
          inset: -100%;
          background-image: url('https://www.transparenttextures.com/patterns/sandpaper.png');
          background-repeat: repeat;
          background-size: 200px;
        }

        /* عاصفة سريعة وعشوائية */
        .fast-storm {
          animation: stormMove 3s linear infinite;
          opacity: 0.3;
        }

        .medium-storm {
          animation: stormMove 7s linear reverse infinite;
          opacity: 0.2;
          filter: blur(2px);
        }

        @keyframes stormMove {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, 5%) rotate(0.5deg); }
          100% { transform: translate(-10%, 10%) rotate(0deg); }
        }

        /* حركة ذرات الرمل الفردية */
        @keyframes sandFly {
          0% { transform: translate(0, 0) opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(-500px, 300px); opacity: 0; }
        }

        @keyframes heatDistortion {
          0%, 100% { backdrop-filter: blur(4px) brightness(1); }
          50% { backdrop-filter: blur(6px) brightness(1.1); }
        }
      `}</style>
    </>
  );
};
