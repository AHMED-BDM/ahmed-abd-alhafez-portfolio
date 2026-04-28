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
      {/* 1. طبقات العاصفة المتحركة */}
      <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden">
        <div className="sand-layer slow" />
        <div className="sand-layer medium" />
        <div className="sand-layer fast" />
      </div>

      {/* 2. طبقة العاصفة الكثيفة */}
      <div
        className="fixed inset-0 pointer-events-none z-[50]"
        style={{
          background: "rgba(160, 120, 60, 0.95)",
          animation: "heatDistortion 6s ease-in-out infinite",
          backdropFilter: "blur(16px) saturate(0.45)",
          WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
          maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
        }}
      >
        {/* نص داخل العاصفة */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
          <p className="font-display text-[10vw] text-amber-900 leading-none">
            𓄿 𓅓 𓋴
          </p>
        </div>
      </div>

      {/* 3. توهج الكشاف */}
      <div
        className="fixed pointer-events-none z-[51] w-[360px] h-[360px] rounded-full"
        style={{
          left: mousePos.x - 180,
          top: mousePos.y - 180,
          background:
            "radial-gradient(circle, rgba(255, 200, 100, 0.1) 0%, transparent 70%)",
          border: "1px solid rgba(251, 191, 36, 0.1)",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.2)",
        }}
      />

      <style>{`
        /* طبقات الرمل */
        .sand-layer {
          position: absolute;
          inset: -50%;
          background-image: url('https://www.transparenttextures.com/patterns/sandpaper.png');
          background-repeat: repeat;
          opacity: 0.15;
        }

        .sand-layer.slow {
          animation: sandMoveSlow 25s linear infinite;
          opacity: 0.1;
          transform: scale(1.2);
        }

        .sand-layer.medium {
          animation: sandMoveMedium 15s linear infinite;
          opacity: 0.15;
        }

        .sand-layer.fast {
          animation: sandMoveFast 8s linear infinite;
          opacity: 0.25;
          filter: blur(2px);
        }

        /* حركة الرياح */
        @keyframes sandMoveSlow {
          0%   { transform: translate(0, 0) scale(1.2); }
          100% { transform: translate(-20%, 10%) scale(1.2); }
        }

        @keyframes sandMoveMedium {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(-40%, 20%); }
        }

        @keyframes sandMoveFast {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(-80%, 40%); }
        }

        /* تموج حرارة */
        @keyframes heatDistortion {
          0% { backdrop-filter: blur(16px) saturate(0.45); }
          50% { backdrop-filter: blur(20px) saturate(0.35); }
          100% { backdrop-filter: blur(16px) saturate(0.45); }
        }
      `}</style>
    </>
  );
};
