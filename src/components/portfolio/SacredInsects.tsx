import { useEffect, useState, useRef } from "react";

// رموز الحشرات الفرعونية المقدسة
const INSECT_SYMBOLS = ["𓆣", "𓆧", "𓆗", "𓆘", "𓆙", "𓆚", "𓅂", "𓆤"];

interface Insect {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface SacredInsectsProps {
  mode: "day" | "night";
}

export const SacredInsects = ({ mode }: SacredInsectsProps) => {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>(0);

  // إنشاء الحشرات عند بدء التشغيل أو تغيير الأبعاد
  useEffect(() => {
    const insectCount = mode === "night" ? 12 : 8; // ليلًا أكثر (ظهور الحشرات)
    const newInsects: Insect[] = [];
    
    for (let i = 0; i < insectCount; i++) {
      newInsects.push({
        id: i,
        symbol: INSECT_SYMBOLS[Math.floor(Math.random() * INSECT_SYMBOLS.length)],
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 20 + 14, // 14-34px
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: mode === "night" ? Math.random() * 0.5 + 0.3 : Math.random() * 0.4 + 0.15,
      });
    }
    setInsects(newInsects);
  }, [dimensions.width, dimensions.height, mode]);

  // تحديث الأبعاد عند تغيير حجم النافذة
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تحريك الحشرات
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === 0) {
        lastTimestampRef.current = timestamp;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      const delta = Math.min(0.05, (timestamp - lastTimestampRef.current) / 1000);
      lastTimestampRef.current = timestamp;
      
      setInsects(prevInsects =>
        prevInsects.map(insect => {
          let newX = insect.x + insect.speedX * delta * 60;
          let newY = insect.y + insect.speedY * delta * 60;
          let newSpeedX = insect.speedX;
          let newSpeedY = insect.speedY;
          
          // ارتداد عند الحواف مع تغيير عشوائي للاتجاه قليلاً
          if (newX < -50) {
            newX = dimensions.width + 30;
            newSpeedX = (Math.random() - 0.5) * 0.8;
            newSpeedY = (Math.random() - 0.5) * 0.8;
          } else if (newX > dimensions.width + 50) {
            newX = -30;
            newSpeedX = (Math.random() - 0.5) * 0.8;
            newSpeedY = (Math.random() - 0.5) * 0.8;
          }
          
          if (newY < -50) {
            newY = dimensions.height + 30;
            newSpeedX = (Math.random() - 0.5) * 0.8;
            newSpeedY = (Math.random() - 0.5) * 0.8;
          } else if (newY > dimensions.height + 50) {
            newY = -30;
            newSpeedX = (Math.random() - 0.5) * 0.8;
            newSpeedY = (Math.random() - 0.5) * 0.8;
          }
          
          return {
            ...insect,
            x: newX,
            y: newY,
            speedX: newSpeedX,
            speedY: newSpeedY,
            rotation: insect.rotation + insect.rotationSpeed * delta * 60,
            opacity: mode === "night" 
              ? Math.sin(Date.now() * 0.001 * insect.id) * 0.2 + 0.4 
              : insect.opacity,
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimestampRef.current = 0;
    };
  }, [dimensions.width, dimensions.height, mode]);

  return (
    <div 
      className="sacred-insects-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 15,
        overflow: "hidden",
      }}
    >
      {insects.map(insect => (
        <div
          key={insect.id}
          className="sacred-insect"
          style={{
            position: "absolute",
            left: insect.x,
            top: insect.y,
            fontSize: `${insect.size}px`,
            transform: `translate(-50%, -50%) rotate(${insect.rotation}deg)`,
            opacity: insect.opacity,
            color: mode === "night" 
              ? `hsl(42, 80%, ${55 + Math.sin(Date.now() * 0.002) * 10}%)` 
              : `hsl(38, 70%, ${40 + Math.sin(Date.now() * 0.003) * 15}%)`,
            textShadow: mode === "night" 
              ? "0 0 8px rgba(255, 215, 0, 0.4)" 
              : "0 0 4px rgba(160, 100, 30, 0.5)",
            filter: mode === "night" ? "drop-shadow(0 0 3px gold)" : "none",
            transition: "opacity 0.5s ease",
            willChange: "transform, left, top",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 15,
          }}
        >
          {insect.symbol}
        </div>
      ))}
      
      <style>{`
        .sacred-insect {
          animation: insectPulse 3s ease-in-out infinite;
        }
        
        @keyframes insectPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        
        /* تحسين الأداء */
        .sacred-insects-container {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};
