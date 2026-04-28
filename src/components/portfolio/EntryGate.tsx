import { useEffect, useState, useRef } from "react";
import gateImg from "@/assets/gate-door.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { DustEffect } from "./DustEffect";
import { sounds } from "@/audio";

const GLYPHS = ["𓂀", "𓋹", "𓆣", "𓊪"];

export const EntryGate = ({ onEnter }: { onEnter: () => void }) => {
  const { t } = useLang();
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [armed, setArmed] = useState(false);
  const [dials, setDials] = useState([0, 1, 2]);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = gateImg;
    img.onload = () => setTimeout(() => setImgLoaded(true), 100);
  }, []);

  const playGateSound = () => {
    if (sounds.gate) {
      sounds.gate.currentTime = 0;
      sounds.gate.volume = 0.85;
      sounds.gate.play().catch(e => console.error("Sound play failed:", e));
    }
  };

  useEffect(() => {
    const isSolved = dials.every(v => v === dials[0]);
    if (isSolved && !armed) {
      setArmed(true);
      setTimeout(() => {
        setOpening(true);
        playGateSound();
        setTimeout(() => {
          setHidden(true);
          onEnter();
        }, 5200);
      }, 650);
    }
  }, [dials, armed, onEnter]);

  const handleDialClick = (idx: number) => {
    if (armed) return;
    const newDials = [...dials];
    newDials[idx] = (newDials[idx] + 1) % GLYPHS.length;
    setDials(newDials);
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${imgLoaded ? "opacity-100" : "opacity-0"}`}>
        
        {/* ✅ الرسالة السرية (أضفناها هنا) */}
        {!armed && !opening && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center w-full px-4 z-30 pointer-events-none transition-opacity duration-1000">
            <p className="font-display text-primary/60 text-xs md:text-sm tracking-[0.2em] mb-2 uppercase drop-shadow-md">
              Remember this code well, you might need it
            </p>
            <p className="font-display text-primary/60 text-xs md:text-sm tracking-[0.2em] mb-4 drop-shadow-md" dir="rtl">
              تذكر هذا الرمز جيدا، ربما ستحتاجه
            </p>
            <p className="font-display text-primary font-bold text-3xl md:text-5xl tracking-[0.5em] drop-shadow-[0_0_20px_var(--primary)]">
              B D M
            </p>
          </div>
        )}

        {/* تأثير الإضاءة الخلفية */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          transition: "opacity 5s cubic-bezier(0.2, 0.9, 0.4, 1)",
          opacity: opening ? 1 : 0,
          background: `radial-gradient(ellipse at center, rgba(212, 175, 55, 0.25) 0%, rgba(180, 120, 40, 0.4) 40%, transparent 80%)`,
          transform: `scale(${opening ? 1.2 : 0.8})`,
        }} />

        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          boxShadow: opening ? "inset 0 0 80px rgba(212, 175, 55, 0.6), 0 0 120px rgba(212, 175, 55, 0.4)" : "inset 0 0 20px rgba(212, 175, 55, 0.2)",
          transition: "box-shadow 5s cubic-bezier(0.2, 0.9, 0.4, 1)",
        }} />

        <DustEffect isActive={opening} />

        <div className="absolute inset-0 flex z-10" style={{ perspective: "1800px", perspectiveOrigin: "center" }}>
          <div className="w-1/2 h-full bg-cover bg-right border-r border-primary/20 transform-gpu will-change-transform"
            style={{
              backgroundImage: `url(${gateImg})`,
              backgroundPosition: "right",
              transformOrigin: "left center",
              transition: "transform 5s cubic-bezier(0.23, 1, 0.32, 1)",
              transform: opening ? "rotateY(-112deg) translate3d(-5px, 0, 0)" : "rotateY(0deg)",
            }} />
          <div className="w-1/2 h-full bg-cover bg-left border-l border-primary/20 transform-gpu will-change-transform"
            style={{
              backgroundImage: `url(${gateImg})`,
              backgroundPosition: "left",
              transformOrigin: "right center",
              transition: "transform 5s cubic-bezier(0.23, 1, 0.32, 1)",
              transform: opening ? "rotateY(112deg) translate3d(5px, 0, 0)" : "rotateY(0deg)",
            }} />
        </div>

        {opening && (
          <div className="absolute inset-0 z-20 pointer-events-none" style={{ animation: "templeShake 1.5s ease-in-out 0.2s 1" }} />
        )}

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
          style={{
            transition: "all 1.2s ease-out",
            opacity: opening ? 0 : 1,
            transform: `translate(-50%, ${opening ? "40px" : "0"})`,
            pointerEvents: opening ? "none" : "auto",
          }}>
          <p className="font-display text-primary/70 text-[10px] tracking-[0.4em] uppercase animate-pulse">
            {armed ? "انكسر الختم القديم" : "طابق الرموز لفتح المعبد"}
          </p>
          <div className="flex gap-4 p-4 bg-black/60 backdrop-blur-md border border-primary/20 rounded-md">
            {dials.map((val, i) => (
              <button key={i} onClick={() => handleDialClick(i)} disabled={armed}
                className={`w-14 h-16 flex items-center justify-center bg-stone-900 border-2 transition-all duration-500 transform-gpu hover:scale-105
                  ${armed ? "border-primary shadow-[0_0_20px_var(--primary)]" : "border-primary/30 hover:border-primary/70"}`}>
                <span className={`text-3xl select-none transition-all duration-500 ${armed ? "text-primary scale-110" : "text-primary/60"}`}>
                  {GLYPHS[val]}
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => { setHidden(true); onEnter(); }}
            className="mt-4 text-[9px] font-display tracking-[0.2em] text-primary/30 hover:text-primary transition-colors">
            {t("gate.skip")}
          </button>
        </div>

        <div className="absolute inset-0 z-30 pointer-events-none bg-white" style={{
          transition: "opacity 0.8s ease-out",
          opacity: armed && !opening ? 0.08 : 0,
        }} />

        {opening && (
          <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="absolute w-1 h-1 bg-gold rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `glowParticle ${1 + Math.random() * 2}s linear forwards`,
                  opacity: 0.6,
                }} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes templeShake { 0%,100%{transform:translate(0,0)}15%{transform:translate(2px,-1px)}30%{transform:translate(-2px,1px)}45%{transform:translate(1px,-2px)}60%{transform:translate(-1px,2px)}75%{transform:translate(0,0)} }
        @keyframes glowParticle { 0%{transform:scale(0) translate(0,0);opacity:0.8} 100%{transform:scale(1.5) translate(${Math.random()*100-50}px,${Math.random()*-200-50}px);opacity:0} }
        .will-change-transform { will-change: transform; }
        .transform-gpu { transform: translate3d(0,0,0); }
      `}</style>
    </div>
  );
};
