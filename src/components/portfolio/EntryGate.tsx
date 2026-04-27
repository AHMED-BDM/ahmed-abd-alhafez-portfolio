import { useEffect, useState } from "react";
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
  
  // ✅ حالة جديدة للتأكد إن الصورة حملت بالكامل
  const [imgLoaded, setImgLoaded] = useState(false);

  // ✅ تحميل مسبق للصورة في الخلفية
  useEffect(() => {
    const img = new Image();
    img.src = gateImg;
    img.onload = () => {
      // بعد ما الصورة تحمل، بنستنى جزء من الثانية عشان نضمن إن المتصفح عالجها
      setTimeout(() => setImgLoaded(true), 300);
    };
  }, []);

  const playGateSound = () => {
    if (sounds.gate) {
      sounds.gate.currentTime = 0;
      sounds.gate.volume = 0.8;
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
        }, 6500);
      }, 1000);
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
      
      {/* الرسالة السرية - تظهر وتستغل وقت التحميل كتمهيد للزائر */}
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

      {/* ✅ الغلاف الكامل للبوابة، مش هيظهر غير لما الصورة تحمل 100% */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${imgLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* تأثير الضوء خلف الأبواب */}
        <div 
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          style={{ 
            transition: "opacity 4s ease-in-out", 
            opacity: opening ? 1 : 0,
            background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)"
          }}
        />

        <DustEffect isActive={opening} />

        {/* الأبواب الـ 3D مع تسريع الهاردوير transform-gpu */}
        <div className="absolute inset-0 flex z-10" style={{ perspective: "2000px" }}>
          <div 
            className="w-1/2 h-full bg-cover bg-right border-r border-primary/10 transform-gpu will-change-transform"
            style={{ 
              backgroundImage: `url(${gateImg})`, 
              transformOrigin: "left center",
              transition: "transform 6s cubic-bezier(0.4, 0, 0.2, 1)", 
              transform: opening ? "rotateY(-105deg) translateZ(0)" : "rotateY(0deg) translateZ(0)"
            }} 
          />
          <div 
            className="w-1/2 h-full bg-cover bg-left border-l border-primary/10 transform-gpu will-change-transform"
            style={{ 
              backgroundImage: `url(${gateImg})`, 
              backgroundPositionX: "-100%",
              transformOrigin: "right center",
              transition: "transform 6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: opening ? "rotateY(105deg) translateZ(0)" : "rotateY(0deg) translateZ(0)"
            }} 
          />
        </div>

        {/* واجهة اللغز */}
        <div 
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
          style={{ 
            transition: "all 1s ease-in-out", 
            opacity: opening ? 0 : 1,
            transform: `translate(-50%, ${opening ? '20px' : '0'})`
          }}
        >
          <p className="font-display text-primary/70 text-[10px] tracking-[0.4em] uppercase animate-pulse">
            {armed ? "انكسر الختم القديم" : "طابق الرموز لفتح المعبد"}
          </p>
          
          <div className="flex gap-4 p-4 bg-black/60 backdrop-blur-md border border-primary/20 rounded-md shadow-[0_0_30px_rgba(0,0,0,0.5)] transform-gpu">
            {dials.map((val, i) => (
              <button
                key={i}
                onClick={() => handleDialClick(i)}
                disabled={armed}
                className={`w-14 h-16 flex items-center justify-center bg-stone-900 border-2 transition-all duration-500 will-change-transform
                  ${armed ? "border-primary shadow-[0_0_15px_var(--primary)]" : "border-primary/30 hover:border-primary/70"}`}
              >
                <span className={`text-3xl select-none transition-all duration-500 ${armed ? "text-primary scale-110" : "text-primary/60"}`}>
                  {GLYPHS[val]}
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => { setHidden(true); onEnter(); }}
            className="mt-4 text-[9px] font-display tracking-[0.2em] text-primary/30 hover:text-primary transition-colors"
          >
            {t("gate.skip")}
          </button>
        </div>

        {/* وميض أبيض خفيف عند بداية الفتح */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none bg-white"
          style={{
            transition: "opacity 2s ease-in-out",
            opacity: (armed && !opening) ? 0.05 : 0
          }}
        />
      </div>
    </div>
  );
};
