import { useState, useEffect, useCallback, useRef } from "react";
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
  
  // استخدام ref لمنع تكرار الفتح
  const hasTriggered = useRef(false);

  const getPan = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    return (relativeX - 0.5) * 1.4;
  };

  const triggerOpen = useCallback((panX = 0) => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    setOpening(true);

    try {
      sounds.box.currentTime = 0;
      sounds.box.play().catch(e => console.log("Audio blocked"));
    } catch (err) { }

    play("spell", { pan: panX, volume: 1 });
    play("open", { pan: panX, volume: 1 });
    if (intensity === "strong") play("rumble", { pan: panX, volume: 1 });
    
    setTimeout(onOpen, 5000);
  }, [play, intensity, onOpen]);

  const handleCharChange = (index: number) => {
    if (isSolved || opening) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const currentIndex = chars.indexOf(input[index]);
    const nextIndex = (currentIndex + 1) % chars.length;
    
    const newInput = [...input];
    newInput[index] = chars[nextIndex];
    setInput(newInput);

    // ✅ التحقق المباشر باستخدام القيمة الجديدة فوراً
    const resultString = newInput.join("");
    console.log("Current Code:", resultString); // للتأكد في الـ Console

    if (resultString === "BDM") {
      setIsSolved(true);
      // تأخير بسيط جداً لرؤية الحرف الأخير
      setTimeout(() => {
        triggerOpen(0);
      }, 400);
    }
    
    // صوت النقرة
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
        className={`group relative ${opening ? "" : "hover:scale-[1.02]"} transition-transform duration-500`}
      >
        <div className={`absolute inset-0 -m-8 rounded-[100px] bg-primary/40 blur-[60px] transition-opacity duration-[3000ms] ${opening ? "opacity-100" : "opacity-0 group-hover:opacity-30"} pointer-events-none z-0`} />
        
        <div className="relative overflow-visible z-10 scale-x-105">
          <img
            src={sarc} alt="Ancient Sarcophagus"
            className="relative w-full h-auto [clip-path:inset(22%_0_0_0)]"
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-[4000ms] ${opening ? "opacity-100" : "opacity-0"}`}>
             <div className="w-[80%] h-[50%] mt-20 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent blur-2xl mix-blend-screen animate-pulse" />
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <DustEffect isActive={opening} />
          </div>

          <img
            src={sarc} alt=""
            className={`absolute inset-0 w-full h-auto z-20 [clip-path:inset(0_0_78%_0)] origin-bottom-right transition-all duration-[4500ms] ease-in-out
            ${opening ? "translate-x-[50%] -translate-y-[20%] rotate-[15deg] opacity-0" : ""}`}
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          {/* لوحة اللغز */}
          <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${opening ? "opacity-0 scale-50 pointer-events-none" : "opacity-100"}`}>
             <div className="flex gap-3 p-3 bg-black/95 backdrop-blur-xl border-2 border-primary/40 rounded-2xl shadow-2xl">
                {input.map((char, i) => (
                    <button
                        key={i}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleCharChange(i); 
                        }}
                        className={`w-14 h-20 flex items-center justify-center bg-stone-900 border-2 transition-all duration-300 rounded-xl
                          ${isSolved ? "border-primary shadow-[0_0_30px_var(--primary)]" : "border-primary/20 hover:border-primary cursor-pointer"}`}
                    >
                        <span className={`text-4xl font-display font-bold ${isSolved ? "text-primary animate-pulse" : "text-primary/60"}`}>
                          {char}
                        </span>
                    </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      <p className={`mt-12 text-center font-display tracking-[0.5em] text-primary text-lg transition-opacity duration-1000 ${opening ? "opacity-0" : "opacity-100"}`}>
        {label}
      </p>
    </div>
  );
};
