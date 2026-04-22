import { useEffect, useRef, useState } from "react";
import { useSound } from "./SoundContext";

export const Curse = () => {
  const [active, setActive] = useState(false);
  const clicks = useRef<number[]>([]);
  const lastTrigger = useRef(0);
  const { play } = useSound();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a,button,input,textarea,[role='button'],label,select");
      if (isInteractive) { clicks.current = []; return; }
      const now = Date.now();
      if (now - lastTrigger.current < 25000) return;
      clicks.current = clicks.current.filter(t => now - t < 4000);
      clicks.current.push(now);
      if (clicks.current.length >= 4) {
        clicks.current = [];
        lastTrigger.current = now;
        setActive(true);
        play("curse");
        document.body.style.animation = "shake 0.4s ease-in-out";
        setTimeout(() => { document.body.style.animation = ""; }, 500);
        setTimeout(() => setActive(false), 3500);
      }
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [play]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-background/40 animate-[fadeIn_0.3s_ease-out]" />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, hsl(8 65% 30% / 0.35), transparent 65%)",
      }} />
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="absolute font-display text-primary text-3xl"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            textShadow: "0 0 20px hsl(42 95% 55%)",
            animation: `curseGlyph 3.2s ease-out ${i * 0.08}s forwards`,
            opacity: 0,
          }}>
          {["𓂀", "𓋹", "𓊃", "𓍢", "𓏤", "𓆣", "𓁶"][i % 7]}
        </span>
      ))}
      <p className="relative font-display text-gold text-xl md:text-2xl tracking-[0.3em] text-center px-6"
        style={{ animation: "curseGlyph 3.2s ease-out forwards", textShadow: "0 0 30px hsl(42 95% 55%)" }}>
        YOU DISTURB WHAT SHOULD<br/>REMAIN HIDDEN…
      </p>
    </div>
  );
};