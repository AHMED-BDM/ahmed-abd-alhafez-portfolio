import { useState, useCallback, useRef } from "react";
import sarc from "@/assets/sarcophagus.png";
import { useSound } from "./SoundContext";
import { sounds } from "../../audio";
import { DustEffect } from "./DustEffect";
import { useLang } from "@/i18n/LanguageContext";

export const Sarcophagus = ({ label, onOpen, intensity = "normal" }: {
  label: string; onOpen: () => void; intensity?: "normal" | "strong";
}) => {
  const { lang } = useLang();
  const [opening, setOpening] = useState(false);
  const [input, setInput] = useState(["A", "A", "A"]);
  const [isSolved, setIsSolved] = useState(false);
  const [shake, setShake] = useState(false);
  const { play } = useSound();
  const hasTriggeredRef = useRef(false);

  const triggerOpen = useCallback((panX = 0) => {
    if (opening || hasTriggeredRef.current) return;

    hasTriggeredRef.current = true;
    setOpening(true);
    setShake(false); // إيقاف الاهتزاز عند الفتح

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

  const handleCharChange = (index: number) => {
    if (isSolved || opening) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const currentIndex = chars.indexOf(input[index]);
    const nextIndex = (currentIndex + 1) % chars.length;

    const newInput = [...input];
    newInput[index] = chars[nextIndex];
    setInput(newInput);

    const code = newInput.join("");

    if (code === "BDM" && !hasTriggeredRef.current) {
      setIsSolved(true);
      setShake(true); // تفعيل الاهتزاز

      // إيقاف الاهتزاز بعد نصف ثانية ثم فتح التابوت
      setTimeout(() => {
        setShake(false);
        setTimeout(() => {
          triggerOpen(0);
        }, 100);
      }, 500);
    }
  };

  return (
    <div className="relative max-w-lg w-[90%] mx-auto select-none">
      <div className={`relative transition-all duration-300 ${shake ? "animate-shake-hard" : ""}`}>
        <img src={sarc} alt="Sarcophagus" className="w-full" />

        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-30">
          {/* ✅ إضافة dir="ltr" لضمان ترتيب الأزرار من اليسار إلى اليمين دائماً */}
          <div className="flex gap-3 p-2 bg-black/90 border-2 border-primary/50 rounded-xl" dir="ltr">
            {input.map((char, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCharChange(i);
                }}
                className="w-12 h-16 flex items-center justify-center bg-stone-900 border-2 border-primary/30 rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-3xl text-primary/70">
                  {char}
                </span>
              </button>
            ))}
          </div>
        </div>

        {opening && <DustEffect isActive={true} />}
      </div>

      <p className="mt-10 text-center text-primary">
        {label}
      </p>
    </div>
  );
};
