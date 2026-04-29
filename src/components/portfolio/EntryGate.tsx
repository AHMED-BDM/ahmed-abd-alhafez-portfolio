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
        // تم زيادة الوقت لـ 7.2 ثانية ليتناسب مع حركة البوابة البطيئة
        setTimeout(() => {
          setHidden(true);
          onEnter();
        }, 7200); 
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
        
        {/* ✅ الرسالة السرية */}
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

        {/* تأثير الإضاءة الخلفية (تظهر من خلف البوابة عند رفعها) */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          transition: "opacity 7s ease-in-out",
          opacity: opening ? 1 : 0,
          background: `radial-gradient(ellipse at center, rgba(212, 175, 55, 0.4) 0%, rgba(180, 120, 40, 0.2) 50%, transparent 100%)`,
          transform: `scale(${opening ? 1.1 : 0.8})`,
        }} />

        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          boxShadow: opening ? "inset 0 0 100px rgba(212, 175, 55, 0.7), 0 0 150px rgba(212, 175, 55, 0.3)" : "inset 0 0 20px rgba(212, 175, 55, 0.1)",
          transition: "box-shadow 7s ease-in-out",
        }} />

        <DustEffect isActive={opening} />

        {/* ✅ البوابة الحجرية (ترتفع للأعلى بشكل مستقيم وبطيء) */}
        <div className="absolute inset-0 flex z-10 overflow-hidden">
          <div className="w-full h-full transform-gpu will-change-transform border-b-[16px] border-primary/40 shadow-[0_30px_60px_rgba(0,0,0,1)] flex items-end justify-center pb-20"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url(${gateImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              /* 7 ثواني مع منحنى فيزيائي: صعوبة في البداية ثم انتظام ثم بطء في النهاية */
              transition: "transform 7s cubic-bezier(0.35, 0.05, 0.2, 1)",
              transform: opening ? "translate3d(0, -105%, 0)" : "translate3d(0, 0, 0)",
            }}>
              {/* خطوط زخرفية أسفل البوابة للإيحاء بسماكة الحجر */}
              <div className="w-full h-2 bg-primary/20 absolute bottom-0 shadow-[0_-5px_20px_rgba(212,175,55,0.3)]"></div>
          </div>
        </div>

        {/* اهتزاز المعبد (طولناه لـ 6.5 ثواني ليواكب رفع الحجر) */}
        {opening && (
          <div className="absolute inset-0 z-20 pointer-events-none" style={{ animation: "templeShake 6.5s ease-in-out 0s 1" }} />
        )}

        {/* أزرار التحكم (الرموز) */}
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
            className="mt-4 text-[9px] font-display tracking-[0.2em] text-primary/30 hover:text-primary transition-colors cursor-pointer">
            {t("gate.skip")}
          </button>
        </div>

        {/* وميض أبيض عند فتح القفل */}
        <div className="absolute inset-0 z-30 pointer-events-none bg-white" style={{
          transition: "opacity 0.8s ease-out",
          opacity: armed && !opening ? 0.08 : 0,
        }} />

        {/* غبار متساقط من السقف بسبب احتكاك البوابة أثناء الرفع */}
        {opening && (
          <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => {
              const delay = Math.random() * 5; // توزيع تساقط الغبار على مدار أول 5 ثواني
              const duration = 2 + Math.random() * 3; 
              return (
                <div key={i} className="absolute bg-primary/60 rounded-full blur-[1px]"
                  style={{
                    top: `-20px`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 6 + 4}px`,
                    animation: `fallingDust ${duration}s linear ${delay}s forwards`,
                    opacity: 0,
                  }} />
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        /* اهتزاز طويل وعشوائي نسبياً */
        @keyframes templeShake { 
          0%, 100% { transform: translate(0, 0) }
          5%, 15%, 25%, 35%, 45%, 55%, 65%, 75%, 85%, 95% { transform: translate(2px, -1px) }
          10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90% { transform: translate(-2px, 1px) }
        }
        /* حركة الغبار المتساقط من أعلى لأسفل */
        @keyframes fallingDust { 
          0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0; } 
          10% { opacity: 0.8; }
          100% { transform: translateY(110vh) scale(1.5) rotate(360deg); opacity: 0; } 
        }
        .will-change-transform { will-change: transform; }
        .transform-gpu { transform: translate3d(0,0,0); }
      `}</style>
    </div>
  );
};
