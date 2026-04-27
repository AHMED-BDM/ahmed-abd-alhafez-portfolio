import { useState } from "react";
import sarc from "@/assets/sarcophagus.png";
import { useSound } from "./SoundContext";
import { sounds } from "../../audio"; 
import { DustEffect } from "./DustEffect"; // ✅ استدعاء الغبار

export const Sarcophagus = ({ label, onOpen, intensity = "normal" }: {
  label: string; onOpen: () => void; intensity?: "normal" | "strong";
}) => {
  const [opening, setOpening] = useState(false);
  const { play } = useSound();

  const getPan = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    return (relativeX - 0.5) * 1.4;
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (opening) return;
    setOpening(true);
    const pan = getPan(event);

    try {
      sounds.box.currentTime = 0;
      sounds.box.play().catch(e => console.log("Audio play blocked by browser"));
    } catch (err) {
      console.log("Audio object not ready");
    }

    play("spell", { pan, volume: 1 });
    play("open", { pan, volume: 1 });
    if (intensity === "strong") play("rumble", { pan, volume: 1 });
    
    // ✅ تأخير تشغيل الحدث الخاص بالتابوت لـ 5 ثواني عشان الغطاء ياخد وقته
    setTimeout(onOpen, 5000);
  };

  return (
    <div className="relative max-w-md mx-auto select-none">
      <div
        onMouseEnter={(event) => play("hover", { pan: getPan(event), volume: 0.9 })}
        onClick={handleClick}
        className={`group relative cursor-pointer ${opening ? "" : "hover:scale-[1.02]"} transition-transform duration-500`}
        style={{ filter: opening ? "drop-shadow(0 0 80px hsl(var(--primary)/0.9))" : "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}
      >
        {/* glow halo - الشعاع يمتد لـ 5 ثواني */}
        <div className={`absolute inset-0 rounded-full blur-3xl bg-primary/50 transition-opacity duration-[5000ms] ease-in-out ${opening ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-50"}`} />

        {/* sarcophagus body */}
        <div className="relative overflow-visible">
          
          <img
            src={sarc} alt="Ancient sarcophagus" loading="lazy"
            className={`relative w-full h-auto transition-all duration-[5000ms] ease-in-out ${opening ? "[clip-path:inset(22%_0_0_0)]" : ""}`}
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />

          {/* الشعاع الداخلي اللي بيخرج من التابوت تدريجياً */}
          <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-[5000ms] ease-in-out ${opening ? "opacity-100" : "opacity-0"}`}>
             <div className="w-full h-[60%] bg-gradient-to-t from-primary/60 via-primary/20 to-transparent blur-2xl mix-blend-screen" />
          </div>

          {/* تأثير الغبار بيخرج من التابوت */}
          <div className="absolute inset-0 z-10">
            <DustEffect isActive={opening} />
          </div>

          {/* sliding lid - ينزلق ببطء لمدة 5 ثواني */}
          <img
            src={sarc} alt="" aria-hidden loading="lazy"
            className={`absolute inset-0 w-full h-auto transition-all duration-[5000ms] ease-in-out [clip-path:inset(0_0_78%_0)] z-20 ${opening ? "-translate-y-48 opacity-0 rotate-6" : ""}`}
          />

          {/* light burst from inside */}
          {opening && (
            <>
              <div className="absolute left-1/2 top-[28%] z-10 -translate-x-1/2 w-40 h-40 rounded-full bg-primary-glow blur-2xl animate-[ripple_5s_ease-out_forwards]" />
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className="absolute left-1/2 top-[30%] w-2 h-2 rounded-full bg-primary z-10 shadow-[0_0_10px_var(--primary)]"
                  style={{
                    animation: `dustOut 5s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${(i / 20) * 360}deg) translateY(-10px)`,
                  }} />
              ))}
            </>
          )}

          {/* gold cracks for "strong" */}
          {opening && intensity === "strong" && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M50 20 L40 50 L55 65 L45 90" stroke="hsl(42 95% 60%)" strokeWidth="0.6" fill="none"
                style={{ filter: "drop-shadow(0 0 4px hsl(42 95% 60%))", strokeDasharray: 200, strokeDashoffset: 200, animation: "crack 3s ease-out forwards" }} />
              <path d="M50 20 L60 45 L48 60 L58 88" stroke="hsl(42 95% 60%)" strokeWidth="0.6" fill="none"
                style={{ filter: "drop-shadow(0 0 4px hsl(42 95% 60%))", strokeDasharray: 200, strokeDashoffset: 200, animation: "crack 3s ease-out forwards" }} />
            </svg>
          )}
        </div>
      </div>

      <p className={`mt-8 text-center font-display tracking-[0.35em] text-primary text-sm torch-flicker transition-opacity duration-1000 ${opening ? "opacity-0" : "opacity-100"}`}>
        {label}
      </p>
      
      {!opening && (
        <p className="text-center text-foreground/60 text-xs mt-2 italic">Tap the sarcophagus to break the seal</p>
      )}
    </div>
  );
};
