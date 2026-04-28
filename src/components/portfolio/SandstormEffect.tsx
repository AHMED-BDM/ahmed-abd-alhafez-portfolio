import { useEffect, useState } from "react";

export const SandstormEffect = ({ mode }: { mode: "day" | "night" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
      {/* 1. طبقات الرمل المتحركة */}
      <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden">
        <div className="sand-layer slow" />
        <div className="sand-layer medium" />
        <div className="sand-layer fast" />
      </div>

      {/* 2. طبقة العاصفة الأساسية (شفافة جزئياً للرؤية المتوسطة) */}
      <div
        className="fixed inset-0 pointer-events-none z-[50]"
        style={{
          background: "rgba(180, 140, 80, 0.55)", // 👈 لون رملي أفتح شوية
          animation: "heatDistortion 6s ease-in-out infinite",
          // 👇 قللنا الضبابية عشان النصوص تبقى مقروءة بصعوبة مش مختفية
          backdropFilter: "blur(3px) saturate(0.7)", 
          
          // 👇 السحر المظبوط: 0% عند الماوس (شفاف تماماً)، 85% في الأطراف (عاصفة متوسطة)
          WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, 
            rgba(0,0,0,0) 0%, 
            rgba(0,0,0,0.4) 40%, 
            rgba(0,0,0,0.85) 100%)`,
            
          maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, 
            rgba(0,0,0,0) 0%, 
            rgba(0,0,0,0.4) 40%, 
            rgba(0,0,0,0.85) 100%)`,
        }}
      />

      {/* 3. توهج الكشاف (تم توسيعه وجعله واقعي) */}
      <div
        className="fixed pointer-events-none z-[51] w-[400px] h-[400px] rounded-full"
        style={{
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          background: "radial-gradient(circle, rgba(255, 230, 150, 0.15) 0%, rgba(255, 200, 100, 0.05) 40%, transparent 70%)",
          filter: "blur(12px)",
          mixBlendMode: "screen" // 👈 بيخلي الإضاءة تندمج مع الخلفية كأنها كشاف حقيقي
        }}
      />

      {/* 4. طبقة ضوضاء خفيفة فوق كل شيء */}
      <div className="fixed inset-0 pointer-events-none z-[52] noise" />

      <style>{`
        /* طبقات الرمل */
        .sand-layer {
          position: absolute;
          inset: -50%;
          background-image: url('https://www.transparenttextures.com/patterns/sandpaper.png');
          background-repeat: repeat;
        }

        .sand-layer.slow {
          animation: sandMoveSlow 30s linear infinite;
          opacity: 0.08;
          transform: scale(1.2);
        }

        .sand-layer.medium {
          animation: sandMoveMedium 18s linear infinite;
          opacity: 0.12;
        }

        .sand-layer.fast {
          animation: sandMoveFast 10s linear infinite;
          opacity: 0.18;
          filter: blur(1px); /* تقليل التغبيش عشان منأثرش على الرؤية العامة زيادة عن اللزوم */
        }

        @keyframes sandMoveSlow {
          0% { transform: translate(0, 0) scale(1.2); }
          100% { transform: translate(-15%, 8%) scale(1.2); }
        }

        @keyframes sandMoveMedium {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-35%, 18%); }
        }

        @keyframes sandMoveFast {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-70%, 35%); }
        }

        /* تموج حرارة - تم تقليل الـ blur ليتناسب مع الرؤية المتوسطة */
        @keyframes heatDistortion {
          0% { backdrop-filter: blur(3px) saturate(0.7); }
          50% { backdrop-filter: blur(5px) saturate(0.6); }
          100% { backdrop-filter: blur(3px) saturate(0.7); }
        }

        /* ضوضاء خفيفة */
        .noise {
          background-image: url('https://www.transparenttextures.com/patterns/noise.png');
          opacity: 0.04;
          animation: noiseMove 0.4s infinite;
        }

        @keyframes noiseMove {
          0% { transform: translate(0,0); }
          25% { transform: translate(-1%,1%); }
          50% { transform: translate(1%,-1%); }
          75% { transform: translate(-1%,-1%); }
          100% { transform: translate(0,0); }
        }
      `}</style>
    </>
  );
};
