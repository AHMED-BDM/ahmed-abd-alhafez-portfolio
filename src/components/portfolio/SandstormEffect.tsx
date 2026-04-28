import { useEffect, useState, useRef } from "react";

interface SandstormEffectProps {
  mode: "day" | "night";
}

export const SandstormEffect = ({ mode }: SandstormEffectProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // لو مش مود النهار، مش محتاجين نسمع لحركة الماوس أصلاً
    if (mode !== "day") return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 150); // زودنا الوقت شوية عشان الحركة تبقى أنعم
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mode]);

  // الـ Return المشروط يكون هنا (بعد الـ Hooks)
  if (mode !== "day") return null;

  return (
    <>
      {/* طبقة الضباب الرملي المشرق - معدلة لتناسب النهار */}
      <div
        className="fixed inset-0 pointer-events-none z-[40]"
        style={{
          background: "radial-gradient(circle at center, rgba(194, 150, 70, 0.08), rgba(160, 100, 40, 0.15))",
          backdropFilter: "sepia(0.3) saturate(1.2) brightness(1.05)",
        }}
      />

      {/* طبقة الجزيئات الذهبية */}
      <div
        className="fixed inset-0 pointer-events-none z-[41]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 40%, rgba(210, 170, 80, 0.4) 1px, transparent 1px),
                            radial-gradient(circle at 80% 70%, rgba(190, 130, 50, 0.3) 1px, transparent 1px)`,
          backgroundSize: "100px 100px, 150px 150px",
          animation: "sandDrift 10s linear infinite",
          opacity: isMoving ? 0.4 : 1, // الجزيئات بتهدى لما الماوس يتحرك
          transition: "opacity 0.5s ease",
        }}
      />

      {/* الكشاف الملكي - يمسح الضباب ويزيد الوضوح */}
      <div
        className="fixed pointer-events-none z-[42] transition-opacity duration-500"
        style={{
          left: mousePos.x - 150,
          top: mousePos.y - 150,
          width: 300,
          height: 300,
          borderRadius: "50%",
          opacity: isMoving ? 1 : 0,
          background: "radial-gradient(circle, transparent 20%, rgba(194, 150, 70, 0.05) 50%, rgba(160, 100, 40, 0.3) 100%)",
          boxShadow: "0 0 50px rgba(218, 165, 32, 0.2)",
          backdropFilter: "blur(0px) contrast(1.1)", // بيمسح البلور اللي وراه
        }}
      />

      <style>{`
        @keyframes sandDrift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 400px 400px, -200px 200px; }
        }
      `}</style>
    </>
  );
};
