import { useEffect, useState } from "react";

export const DustEffect = ({ isActive }: { isActive: boolean }) => {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; duration: string; size: string }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 1.5}s`,
        duration: `${Math.random() * 3 + 4}s`, // من 4 لـ 7 ثواني
        size: `${Math.random() * 4 + 2}px`, 
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <style>
        {`
          @keyframes float-dust-cinematic {
            0% { transform: translateY(100px) translateX(0px) scale(0.5); opacity: 0; filter: blur(1px); }
            20% { opacity: 0.8; scale: 1; }
            50% { transform: translateY(-100px) translateX(20px); filter: blur(2px); }
            80% { opacity: 0.5; }
            100% { transform: translateY(-300px) translateX(-30px) scale(1.5); opacity: 0; filter: blur(4px); }
          }
          .dust-particle-cinematic {
            position: absolute;
            bottom: 10%;
            background-color: #d4af37;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px rgba(212, 175, 55, 0.8);
            animation: float-dust-cinematic linear forwards;
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle-cinematic"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};
