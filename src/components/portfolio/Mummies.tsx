import { useEffect, useState } from "react";

const Mummy = ({ side, mode }: { side: "left" | "right"; mode: "night" | "day" }) => {
  const [glow, setGlow] = useState(false);
  const [tilt, setTilt] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = side === "left" ? 60 : window.innerWidth - 60;
      const y = window.innerHeight / 2;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      const dist = Math.hypot(dx, dy);
      setGlow(dist < 280);
      setTilt(Math.max(-8, Math.min(8, dx / 40)));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [side]);

  return (
    <div className={`pointer-events-none fixed bottom-0 ${side === "left" ? "left-2" : "right-2"} z-[15] hidden lg:block`}
      style={{ opacity: mode === "day" ? 0.18 : 0.55, transition: "opacity 0.8s" }}>
      <svg width="90" height="220" viewBox="0 0 90 220" style={{ animation: "float 7s ease-in-out infinite" }}>
        <defs>
          <linearGradient id={`wrap-${side}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(38 35% 55%)" />
            <stop offset="100%" stopColor="hsl(28 25% 25%)" />
          </linearGradient>
        </defs>
        <g style={{ transform: `rotate(${tilt * 0.3}deg)`, transformOrigin: "45px 50px", transition: "transform 0.6s ease" }}>
          {/* head */}
          <ellipse cx="45" cy="40" rx="22" ry="28" fill={`url(#wrap-${side})`} />
          {/* bandage stripes head */}
          {[18, 28, 38, 48, 58].map(y => (
            <path key={y} d={`M25 ${y} Q45 ${y - 3} 65 ${y}`} stroke="hsl(28 30% 18%)" strokeWidth="1" fill="none" opacity="0.6" />
          ))}
          {/* eyes */}
          <ellipse cx="36" cy="42" rx="2.4" ry="1.6" fill={glow ? "hsl(42 95% 65%)" : "hsl(28 30% 12%)"}
            style={{ filter: glow ? "drop-shadow(0 0 6px hsl(42 95% 60%))" : "none", transition: "all 0.4s" }} />
          <ellipse cx="54" cy="42" rx="2.4" ry="1.6" fill={glow ? "hsl(42 95% 65%)" : "hsl(28 30% 12%)"}
            style={{ filter: glow ? "drop-shadow(0 0 6px hsl(42 95% 60%))" : "none", transition: "all 0.4s" }} />
        </g>
        {/* body */}
        <rect x="22" y="68" width="46" height="140" rx="6" fill={`url(#wrap-${side})`} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M22 ${78 + i * 11} Q45 ${75 + i * 11} 68 ${78 + i * 11}`} stroke="hsl(28 30% 18%)" strokeWidth="0.8" fill="none" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
};

export const Mummies = ({ mode }: { mode: "night" | "day" }) => (
  <>
    <Mummy side="left" mode={mode} />
    <Mummy side="right" mode={mode} />
  </>
);