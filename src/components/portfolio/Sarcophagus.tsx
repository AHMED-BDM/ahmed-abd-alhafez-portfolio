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
  const hasTriggeredRef = useRef(false);

  const getPan = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    return (relativeX - 0.5) * 1.4;
  };

  const triggerOpen = useCallback((panX = 0) => {
    if (opening || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setOpening(true);

    try {
      if (sounds.box) {
        sounds.box.currentTime = 0;
        sounds.box.play().catch(() => {});
      }
    } catch {}

    play("spell", { pan: panX, volume: 1 });
    play("open", { pan: panX, volume: 1 });
    if (intensity === "strong") play("rumble", { pan: panX, volume: 1 });

    setTimeout(() => {
      onOpen();
    }, 5000);
  }, [opening, play, intensity, onOpen]);

  // ✅ الحل هنا: التحقق داخل useEffect
  useEffect(() => {
    const code = input.join("");
    if (code === "BDM" && !isSolved && !opening) {
      setIsSolved(true);
      setTimeout(() => triggerOpen(0), 200);
    }
  }, [input, isSolved, opening, triggerOpen]);

  const handleCharChange = (index: number) => {
    if (isSolved || opening) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const currentChar = input[index];
    const currentIdx = chars.indexOf(currentChar);
    const nextIdx = (currentIdx + 1) % chars.length;
    const newChar = chars[nextIdx];

    const newInput = [...input];
    newInput[index] = newChar;
    setInput(newInput);

    // صوت بسيط
    try {
      const AudioContextClass =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 180;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {}
  };

  return (
    <div className="relative max-w-lg w-[90%] mx-auto select-none perspective-1000">
      <div
        onMouseEnter={(event) =>
          !opening && play("hover", { pan: getPan(event), volume: 0.9 })
        }
        className={`group relative ${opening ? "" : "hover:scale-[1.02]"} transition-transform duration-500`}
      >
        <div className="relative overflow-visible z-10 scale-x-105">
          
          <img
            src={sarc}
            alt="Sarcophagus"
            className="relative w-full h-auto [clip-path:inset(22%_0_0_0)]"
          />

          {/* Puzzle */}
          <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 z-30 ${opening ? "opacity-0" : "opacity-100"}`}>
            <div className="flex gap-3 p-2 bg-black/90 border-2 border-primary/50 rounded-xl">
              {input.map((char, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCharChange(i);
                  }}
                  className="w-12 h-16 flex items-center justify-center bg-stone-900 border-2 border-primary/30 rounded-lg"
                >
                  <span className="text-3xl text-primary/70">
                    {char}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <p className="mt-10 text-center text-primary">
        {label}
      </p>
    </div>
  );
};
