import { useState, useEffect } from "react";
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

  const handleCharChange = (index: number) => {
    if (isSolved || opening) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const currentIndex = chars.indexOf(input[index]);
    const nextIndex = (currentIndex + 1) % chars.length;
    
    const newInput = [...input];
    newInput[index] = chars[nextIndex];
    setInput(newInput);
    
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const click = new AudioContextClass();
        const osc = click.createOscillator();
        const g = click.createGain();
        osc.frequency.value = 180;
        g.gain.setValueAtTime(0.05, click.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, click.currentTime + 0.1);
        osc.connect(g).connect(click.destination);
        osc.start(); osc.stop(click.currentTime + 0.1);
      }
    } catch(e) {}
  };

  const triggerOpen = (panX = 0) => {
    if (opening) return;
    setOpening(true);

    try {
      sounds.box.currentTime = 0;
      sounds.box.play().catch(e => console.log("Audio play blocked by browser"));
    } catch (err) {
      console.log("Audio object not ready");
    }

    play("spell", { pan: panX, volume: 1 });
    play("open", { pan: panX, volume: 1 });
    if (intensity === "strong") play("rumble", { pan: panX, volume: 1 });
    
    setTimeout(onOpen, 5000);
  };

  useEffect(() => {
    if (input.join("") === "BDM" && !isSolved) {
      setIsSolved(true);
      setTimeout(() => {
        triggerOpen(0);
      }, 800);
    }
  }, [input, isSolved]);

  return (
    // ✅ تكبير العرض ليكون أضخم باستخدام max-w-lg
    <div className="relative max-w-lg w-[90%] mx-auto select-none perspective-1000">
      
      {/* الغلاف الخارجي مع إلغاء الفلاتر الثقيلة واستخدام الظلال المحسنة */}
      <div
        onMouseEnter={(event) => play("hover", { pan: getPan(event), volume: 0.9 })}
        className={`group relative ${opening ? "" : "hover:scale-[1.02]"} transition-transform duration-500 will-change-transform`}
      >
        
        {/* ✅ تأثير التوهج الخلفي (خفيف على المتصفح بدلاً من drop-shadow) */}
        <div 
          className={`absolute inset-0 -m-8 rounded-[100px] bg-primary/40 blur-[60px] transition-opacity duration-[3000ms] ease-in-out pointer-events-none z-0
          ${opening ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`} 
        />
        <div 
          className={`absolute inset-0 -m-4 rounded-3xl bg-black/50 blur-2xl transition-opacity duration-1000 pointer-events-none z-0
          ${opening ? "opacity-0" : "opacity-100"}`} 
        />

        {/* جسم التابوت - ✅ تم تعريضه قليلاً باستخدام scale-x-105 */}
        <div className="relative overflow-visible z-10 scale-x-105">
          
          {/* الجزء السفلي من التابوت (ثابت) */}
          <img
            src={sarc} alt="Ancient sarcophagus" loading="lazy"
            className="relative w-full h-auto [clip-path:inset(22%_0_0_0)] transform-gpu"
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          {/* الشعاع الداخلي اللي بيخرج من التابوت */}
          <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-[4000ms] ease-out ${opening ? "opacity-100" : "opacity-0"}`}>
             <div className="w-[80%] h-[50%] mt-20 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent blur-2xl mix-blend-screen transform-gpu" />
          </div>

          {/* تأثير الغبار */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <DustEffect isActive={opening} />
          </div>

          {/* الغطاء (الذي ينزلق) - ✅ حركة انزلاق جانبية واقعية جداً */}
          <img
            src={sarc} alt="" aria-hidden loading="lazy"
            className={`absolute inset-0 w-full h-auto z-20 [clip-path:inset(0_0_78%_0)] origin-bottom-right transition-all duration-[4500ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform-gpu will-change-transform
            ${opening ? "translate-x-[25%] -translate-y-[15%] rotate-[12deg] opacity-0" : ""}`}
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          {/* لوحة اللغز (النظام السري) */}
          <div 
            className={`absolute top-[40%] left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 transform-gpu
            ${opening ? "opacity-0 translate-x-[50%] -translate-y-[20%] rotate-12 pointer-events-none" : "opacity-100"}`}
          >
             <div className="flex gap-3 p-2 bg-black/80 backdrop-blur-sm border-2 border-primary/30 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                {input.map((char, i) => (
                    <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); handleCharChange(i); }}
                        disabled={isSolved}
                        className={`w-12 h-14 flex items-center justify-center bg-stone-900/90 border-2 transition-all duration-300
                          ${isSolved ? "border-primary shadow-[0_0_20px_var(--primary)]" : "border-primary/50 hover:border-primary cursor-pointer active:scale-95 hover:bg-stone-800"}`}
                    >
                        <span className={`text-3xl font-display transition-colors duration-500 ${isSolved ? "text-primary scale-110 drop-shadow-[0_0_8px_var(--primary)]" : "text-primary/70"}`}>
                          {char}
                        </span>
                    </button>
                ))}
             </div>
          </div>

          {/* الانفجار الضوئي والشرارات */}
          {opening && (
            <>
              <div className="absolute left-1/2 top-[35%] z-10 -translate-x-1/2 w-48 h-48 rounded-full bg-primary/40 blur-[40px] animate-[ripple_4s_ease-out_forwards] mix-blend-screen pointer-events-none" />
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} className="absolute left-1/2 top-[40%] w-2 h-2 rounded-full bg-primary z-20 shadow-[0_0_12px_var(--primary)] pointer-events-none"
                  style={{
                    animation: `dustOut 4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
                    animationDelay: `${i * 0.05}s`,
                    transform: `rotate(${(i / 25) * 360}deg) translateY(-20px)`,
                  }} />
              ))}
            </>
          )}

          {/* التشققات الذهبية */}
          {opening && intensity === "strong" && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M50 30 L40 50 L55 65 L45 85" stroke="hsl(42 95% 60%)" strokeWidth="0.8" fill="none"
                style={{ filter: "drop-shadow(0 0 6px hsl(42 95% 60%))", strokeDasharray: 200, strokeDashoffset: 200, animation: "crack 2.5s ease-out forwards" }} />
              <path d="M50 30 L60 45 L48 60 L58 80" stroke="hsl(42 95% 60%)" strokeWidth="0.8" fill="none"
                style={{ filter: "drop-shadow(0 0 6px hsl(42 95% 60%))", strokeDasharray: 200, strokeDashoffset: 200, animation: "crack 2.5s ease-out forwards" }} />
            </svg>
          )}
        </div>
      </div>

      <p className={`mt-10 text-center font-display tracking-[0.4em] text-primary text-base torch-flicker transition-opacity duration-1000 ${opening ? "opacity-0" : "opacity-100"}`}>
        {label}
      </p>
      
      {!opening && (
        <div className="text-center mt-3 flex flex-col gap-1 transition-opacity duration-500">
          <p className="text-foreground/50 text-[10px] uppercase tracking-[0.2em]">
            Enter the code to break the seal
          </p>
          <p className="text-foreground/50 text-xs tracking-widest" dir="rtl">
            أدخل الرمز لكسر الختم
          </p>
        </div>
      )}
    </div>
  );
};
