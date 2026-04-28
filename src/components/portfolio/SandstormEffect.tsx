import { useEffect, useState } from "react";

interface SandstormEffectProps {
  mode: "day" | "night";
}

export const SandstormEffect = ({ mode }: SandstormEffectProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  let timeout: NodeJS.Timeout;

  if (mode !== "day") return null;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMoving(false), 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      {/* طبقة الضباب الرملي الخفيفة */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 40,
          background: "radial-gradient(circle at center, rgba(194, 150, 70, 0.15), rgba(160, 100, 40, 0.25))",
          backdropFilter: "blur(3px) brightness(0.95) sepia(0.2)",
        }}
      />

      {/* طبقة الجزيئات المتحركة */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 41,
          backgroundImage: `radial-gradient(circle at 20% 40%, rgba(210, 170, 80, 0.3) 1px, transparent 1px),
                            radial-gradient(circle at 80% 70%, rgba(190, 130, 50, 0.2) 1px, transparent 1px),
                            radial-gradient(circle at 50% 90%, rgba(200, 150, 60, 0.25) 1px, transparent 1px)`,
          backgroundSize: "120px 120px, 180px 180px, 90px 90px",
          animation: "sandDrift 15s linear infinite",
        }}
      />

      {/* الكشاف الدائري حول الماوس - يزيل التأثيرات محلياً */}
      {isMoving && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x - 130,
            top: mousePos.y - 130,
            width: 260,
            height: 260,
            borderRadius: "50%",
            pointerEvents: "none",
            zIndex: 42,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.7)",
            background: "radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      )}

      <style>{`
        @keyframes sandDrift {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 200px 150px, 300px 200px, 150px 100px; }
        }
      `}</style>
    </>
  );
};
