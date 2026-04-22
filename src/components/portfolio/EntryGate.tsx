import { useEffect, useState } from "react";
import gateImg from "@/assets/gate-door.jpg";

export const EntryGate = ({ onEnter }: { onEnter: () => void }) => {
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOpening(true), 1200);
    const t2 = setTimeout(() => { setHidden(true); onEnter(); }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onEnter]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-hidden flex items-center justify-center">
      {/* light beam */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-primary blur-md opacity-90 torch-flicker" />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary)/0.25), transparent 60%)" }} />

      {/* dust particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <span key={i} className="absolute w-1 h-1 rounded-full bg-primary/60 float-slow"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*4}s` }} />
      ))}

      {/* doors */}
      <div className="absolute inset-0 flex" style={{ perspective: "1500px" }}>
        <div className={`w-1/2 h-full bg-cover bg-right shadow-deep ${opening ? "gate-open-left" : ""}`}
             style={{ backgroundImage: `url(${gateImg})`, transformOrigin: "left center" }} />
        <div className={`w-1/2 h-full bg-cover bg-left shadow-deep ${opening ? "gate-open-right" : ""}`}
             style={{ backgroundImage: `url(${gateImg})`, backgroundPositionX: "-100%", transformOrigin: "right center" }} />
      </div>

      <button onClick={() => { setHidden(true); onEnter(); }}
        className="absolute bottom-8 right-8 z-10 text-xs font-display tracking-widest text-primary/70 hover:text-primary transition">
        SKIP ›
      </button>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="font-display text-primary text-sm tracking-[0.4em] torch-flicker">ENTER · THE · TEMPLE</p>
      </div>
    </div>
  );
};
