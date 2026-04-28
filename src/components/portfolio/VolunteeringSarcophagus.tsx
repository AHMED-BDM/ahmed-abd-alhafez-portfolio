import { useState, useEffect } from "react";
import sarc from "@/assets/sarcophagus.png";
import { useSound } from "./SoundContext";
import { useLang } from "@/i18n/LanguageContext";
import { DustEffect } from "./DustEffect";

export const VolunteeringSarcophagus = () => {
  const { t } = useLang();
  const { play } = useSound();
  const [opening, setOpening] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [rotations, setRotations] = useState([0, 90, 270]); 

  const rotateDial = (index: number) => {
    if (isSolved) return;
    const newRots = [...rotations];
    newRots[index] = (newRots[index] + 90) % 360;
    setRotations(newRots);
    try { play("hover", { volume: 0.4 }); } catch(e) {}
  };

  useEffect(() => {
    if (rotations.every(r => r === rotations[0])) {
      setIsSolved(true);
      setTimeout(() => {
        setOpening(true);
        try { play("open", { volume: 1 }); } catch(e) {}
      }, 800);
    }
  }, [rotations]);

  return (
    <section className="relative py-32 px-4 bg-black/20">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="text-primary/50 font-display tracking-[0.6em] text-xs uppercase">{t("vol.eyebrow")}</span>
        <h2 className="text-5xl md:text-7xl text-primary font-display mt-6 tracking-tighter uppercase drop-shadow-2xl">{t("vol.title")}</h2>
      </div>

      <div className="relative max-w-xl w-full mx-auto perspective-2000">
        <div className={`relative transition-all duration-1000 ${opening ? "scale-110" : ""}`}>
          
          <div className="relative overflow-visible z-10 scale-x-110">
            {/* القاع (ثابت) */}
            <img src={sarc} className="w-full h-auto [clip-path:inset(22%_0_0_0)] brightness-75 transform-gpu" />
            
            {/* اللغز: الساعات الثلاث */}
            {!opening && (
              <div className="absolute top-[42%] left-0 w-full flex justify-center gap-10 z-30 px-6">
                {rotations.map((rot, i) => (
                  <button
                    key={i}
                    onClick={() => rotateDial(i)}
                    className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-b from-stone-800 to-black border-2 border-primary/20 hover:border-primary/80 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.9)] group"
                  >
                    <div 
                      className="w-1 h-12 md:h-16 bg-gradient-to-t from-primary via-primary/50 to-transparent rounded-full transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                      style={{ transform: `rotate(${rot}deg)` }}
                    />
                    <div className="absolute inset-0 rounded-full border border-primary/5 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* الغطاء السلس */}
            <img 
              src={sarc} 
              className={`absolute inset-0 w-full h-auto z-20 [clip-path:inset(0_0_78%_0)] transition-all duration-[4500ms] ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu
              ${opening ? "translate-x-[45%] -translate-y-[20%] rotate-[18deg] opacity-0" : ""}`} 
            />

            <div className="absolute inset-0 z-10 pointer-events-none">
              <DustEffect isActive={opening} />
            </div>

            {/* محتوى التطوع الداخلي */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-10 text-center transition-opacity duration-[3000ms] ${opening ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <p className="text-primary/70 text-[11px] font-display mb-8 tracking-[0.2em] max-w-xs">{t("vol.p1")}</p>
              
              <div className="grid gap-6 w-full">
                <div className="p-4 border-l-2 border-primary/30 bg-primary/5 backdrop-blur-md">
                  <h4 className="text-primary text-sm font-bold uppercase tracking-widest mb-2 text-left">{t("vol.project1.title")}</h4>
                  <p className="text-white/60 text-[10px] text-left leading-relaxed">{t("vol.project1.desc")}</p>
                </div>
                <div className="p-4 border-l-2 border-primary/30 bg-primary/5 backdrop-blur-md">
                  <h4 className="text-primary text-sm font-bold uppercase tracking-widest mb-2 text-left">{t("vol.project2.title")}</h4>
                  <p className="text-white/60 text-[10px] text-left leading-relaxed">{t("vol.project2.desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-16">
        <p className={`text-primary/40 font-display text-[10px] tracking-[0.5em] uppercase transition-all duration-1000 ${opening ? "opacity-0" : "opacity-100 animate-pulse"}`}>
          {t("vol.solve")}
        </p>
      </div>
    </section>
  );
};
