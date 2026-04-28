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

      {/* 2. طبقة العاصفة الأساسية (شفافة جزئياً) */}
      <div
        className="fixed inset-0 pointer-events-none z-[50]"
        style={{
          background: "rgba(160, 120, 60, 0.75)", // 👈 أخف من قبل
          animation: "heatDistortion 6s ease-in-out infinite",
          backdropFilter: "blur(10px) saturate(0.6)", // 👈 أقل blur
          
          // 👇 هنا السحر: مش شفافية كاملة، في تدرج
          WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px,
            rgba(0,0,0,0.2) 0%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,1) 100%)`,
          
          maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px,
            rgba(0,0,0,0.2) 0%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,1) 100%)`,
        }}
      />

      {/* 3. توهج الكشاف */}
      <div
        className="fixed pointer-events-none z-[51] w-[300px] h-[300px] rounded-full"
        style={{
          left: mousePos.x - 150,
          top: mousePos.y - 150,
          background:
            "radial-gradient(circle, rgba(255, 220, 120, 0.25) 0%, rgba(255,200,100,0.08) 40%, transparent 70%)",
          filter: "blur(8px)",
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
          filter: blur(1.5px);
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

        /* تموج حرارة */
        @keyframes heatDistortion {
          0% { backdrop-filter: blur(10px) saturate(0.6); }
          50% { backdrop-filter: blur(14px) saturate(0.5); }
          100% { backdrop-filter: blur(10px) saturate(0.6); }
        }

        /* ضوضاء خفيفة */
        .noise {
          background-image: url('https://www.transparenttextures.com/patterns/noise.png');
          opacity: 0.05;
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
