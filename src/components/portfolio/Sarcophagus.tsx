import { useState, useEffect, useCallback } from "react";
import sarc from "@/assets/sarcophagus.png";
import { useSound } from "./SoundContext";
import { sounds } from "../../audio"; 
import { DustEffect } from "./DustEffect";

export const Sarcophagus = ({ label, onOpen, intensity = "normal" }: {
  label: string; onOpen: () => void; intensity?: "normal" | "strong";
}) => {
  const [opening, setOpening] = useState(false);
  const [input, setInput] = useState(["A", "A", "A"]);
  const [isSolved, setIsSolved] = useState(false);
  const { play } = useSound();

  const getPan = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    return (relativeX - 0.5) * 1.4;
  };

  // ✅ دالة الفتح أصبحت مستقلة لضمان استدعائها بدقة
  const triggerOpen = useCallback((panX = 0) => {
    if (opening) return;
    setOpening(true);

    try {
      sounds.box.currentTime = 0;
      sounds.box.play().catch(e => console.log("Audio blocked"));
    } catch (err) { }

    play("spell", { pan: panX, volume: 1 });
    play("open", { pan: panX, volume: 1 });
    if (intensity === "strong") play("rumble", { pan: panX, volume: 1 });
    
    // الانتقال للمرحلة التالية بعد انتهاء الأنميشن
    setTimeout(onOpen, 5000);
  }, [opening, play, intensity, onOpen]);

  // ✅ تعديل منطق تغيير الحرف ليكون أسرع ويتحقق فوراً
  const handleCharChange = (index: number) => {
    if (isSolved || opening) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const currentIndex = chars.indexOf(input[index]);
    const nextIndex = (currentIndex + 1) % chars.length;
    
    const newInput = [...input];
    newInput[index] = chars[nextIndex];
    setInput(newInput);

    // التحقق الفوري داخل الدالة لضمان عدم حدوث Delay من الـ useEffect
    if (newInput.join("") === "BDM") {
      setIsSolved(true);
      setTimeout(() => triggerOpen(0), 600);
    }
    
    // صوت النقرة البسيط
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = 180;
        g.gain.setValueAtTime(0.05, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        osc.connect(g).connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      }
    } catch(e) {}
  };

  return (
    <div className="relative max-w-lg w-[90%] mx-auto select-none perspective-1000">
      <div
        onMouseEnter={(event) => !opening && play("hover", { pan: getPan(event), volume: 0.9 })}
        className={`group relative ${opening ? "" : "hover:scale-[1.02]"} transition-transform duration-500 will-change-transform`}
      >
        
        {/* التوهج الخلفي */}
        <div className={`absolute inset-0 -m-8 rounded-[100px] bg-primary/40 blur-[60px] transition-opacity duration-[3000ms] ${opening ? "opacity-100" : "opacity-0 group-hover:opacity-30"} pointer-events-none z-0`} />
        
        <div className="relative overflow-visible z-10 scale-x-105">
          {/* جسم التابوت السفلي */}
          <img
            src={sarc} alt="Sarcophagus"
            className="relative w-full h-auto [clip-path:inset(22%_0_0_0)] transform-gpu"
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          {/* الشعاع الداخلي عند الفتح */}
          <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-[4000ms] ${opening ? "opacity-100" : "opacity-0"}`}>
             <div className="w-[80%] h-[50%] mt-20 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent blur-2xl mix-blend-screen" />
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <DustEffect isActive={opening} />
          </div>

          {/* الغطاء المنزلق */}
          <img
            src={sarc} alt=""
            className={`absolute inset-0 w-full h-auto z-20 [clip-path:inset(0_0_78%_0)] origin-bottom-right transition-all duration-[4500ms] ease-in-out transform-gpu
            ${opening ? "translate-x-[40%] -translate-y-[20%] rotate-[15deg] opacity-0" : ""}`}
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          {/* لوحة اللغز */}
          <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${opening ? "opacity-0 scale-50 pointer-events-none" : "opacity-100"}`}>
             <div className="flex gap-3 p-2 bg-black/90 backdrop-blur-md border-2 border-primary/50 rounded-xl shadow-2xl">
                {input.map((char, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); handleCharChange(i); }}
                        className={`w-12 h-16 flex items-center justify-center bg-stone-900 border-2 transition-all duration-300 rounded-lg
                          ${isSolved ? "border-primary shadow-[0_0_25px_var(--primary)]" : "border-primary/30 hover:border-primary cursor-pointer active:scale-90"}`}
                    >
                        <span className={`text-3xl font-display ${isSolved ? "text-primary animate-pulse" : "text-primary/70"}`}>
                          {char}
                        </span>
                    </button>
                ))}
             </div>
          </div>

          {/* تأثيرات الانفجار الضوئي */}
          {opening && (
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute left-1/2 top-[35%] -translate-x-1/2 w-64 h-64 rounded-full bg-primary/30 blur-[50px] animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <p className={`mt-10 text-center font-display tracking-[0.4em] text-primary text-base torch-flicker transition-opacity duration-1000 ${opening ? "opacity-0" : "opacity-100"}`}>
        {label}
      </p>
    </div>
  );
};
