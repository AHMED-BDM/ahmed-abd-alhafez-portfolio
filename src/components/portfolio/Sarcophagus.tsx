import { useState } from "react";
import sarc from "@/assets/sarcophagus.png";
import { useSound } from "./SoundContext";

export const Sarcophagus = ({ label, onOpen, intensity = "normal" }: {
  label: string; onOpen: () => void; intensity?: "normal" | "strong";
}) => {
  const [opening, setOpening] = useState(false);
  const { play } = useSound();

  const handleClick = () => {
    if (opening) return;
    setOpening(true);
    play("open");
    if (intensity === "strong") play("rumble");
    setTimeout(onOpen, intensity === "strong" ? 1500 : 1200);
  };

  return (
    <div className="relative max-w-md mx-auto select-none">
      <div
        onMouseEnter={() => play("hover")}
        onClick={handleClick}
        className={`group relative cursor-pointer ${opening ? "" : "hover:scale-[1.02]"} transition-transform duration-500`}
        style={{ filter: opening ? "drop-shadow(0 0 60px hsl(var(--primary)/0.8))" : "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}
      >
        {/* glow halo */}
        <div className={`absolute inset-0 rounded-full blur-3xl bg-primary/40 transition-opacity duration-700 ${opening ? "opacity-90" : "opacity-0 group-hover:opacity-50"}`} />

        {/* sarcophagus body (lid slides up & away) */}
        <div className="relative">
          <img
            src={sarc} alt="Ancient sarcophagus" loading="lazy"
            className={`relative w-full h-auto transition-all duration-[1400ms] ease-out ${opening ? "[clip-path:inset(22%_0_0_0)]" : ""}`}
            style={{ animation: opening ? "none" : "float 6s ease-in-out infinite" }}
          />
          {/* sliding lid */}
          <img
            src={sarc} alt="" aria-hidden loading="lazy"
            className={`absolute inset-0 w-full h-auto transition-all duration-[1400ms] ease-out [clip-path:inset(0_0_78%_0)] ${opening ? "-translate-y-32 opacity-0 rotate-3" : ""}`}
          />

          {/* light burst from inside */}
          {opening && (
            <>
              <div className="absolute left-1/2 top-[28%] -translate-x-1/2 w-40 h-40 rounded-full bg-primary-glow blur-2xl animate-[ripple_1.4s_ease-out]" />
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="absolute left-1/2 top-[30%] w-1 h-1 rounded-full bg-primary"
                  style={{
                    animation: `dustOut 1.4s ease-out forwards`,
                    animationDelay: `${i * 0.04}s`,
                    transform: `rotate(${(i / 14) * 360}deg) translateY(-10px)`,
                  }} />
              ))}
            </>
          )}

          {/* gold cracks for "strong" */}
          {opening && intensity === "strong" && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M50 20 L40 50 L55 65 L45 90" stroke="hsl(42 95% 60%)" strokeWidth="0.4" fill="none"
                style={{ filter: "drop-shadow(0 0 2px hsl(42 95% 60%))", strokeDasharray: 200, strokeDashoffset: 200, animation: "crack 1.2s ease-out forwards" }} />
              <path d="M50 20 L60 45 L48 60 L58 88" stroke="hsl(42 95% 60%)" strokeWidth="0.4" fill="none"
                style={{ filter: "drop-shadow(0 0 2px hsl(42 95% 60%))", strokeDasharray: 200, strokeDashoffset: 200, animation: "crack 1.2s ease-out forwards" }} />
            </svg>
          )}
        </div>
      </div>

      <p className="mt-8 text-center font-display tracking-[0.35em] text-primary text-sm torch-flicker">
        {opening ? "𓋹 · OPENING · 𓋹" : label}
      </p>
      {!opening && (
        <p className="text-center text-foreground/60 text-xs mt-2 italic">Tap the sarcophagus to break the seal</p>
      )}
    </div>
  );
};