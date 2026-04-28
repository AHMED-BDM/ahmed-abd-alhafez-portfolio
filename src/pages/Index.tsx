import { useEffect, useRef, useState } from "react";
// 1. استيراد createPortal من react-dom
import { createPortal } from "react-dom"; 
import { X, MessageSquare } from "lucide-react";
import { useSound } from "./SoundContext";
import { useLang } from "@/i18n/LanguageContext";
import { sounds } from "../../audio";

const openPharaohChat = () => {
  const chatButton = document.querySelector('[data-pharaoh-chat-trigger]') as HTMLElement;
  if (chatButton) chatButton.click();
  else window.dispatchEvent(new CustomEvent("openPharaohChat"));
};

export const HiddenChamber = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const clicksRef = useRef<number[]>([]);
  const { play } = useSound();
  const { t, lang } = useLang();

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      if (scrollHeight <= windowHeight) return;
      const max = scrollHeight - windowHeight;
      const scrolled = window.scrollY / max;
      if (scrolled > 0.92 && !unlocked && window.scrollY > 30) {
        setUnlocked(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [unlocked]);

  const onSigilClick = () => {
    const now = Date.now();
    clicksRef.current = clicksRef.current.filter((t) => now - t < 2500);
    clicksRef.current.push(now);
    play("hover", { pan: 0.1, volume: 0.6 });
    if (clicksRef.current.length >= 3) {
      clicksRef.current = [];
      setUnlocked(true);
      play("open", { pan: 0, volume: 0.7 });
      sounds.ancient.currentTime = 0;
      sounds.ancient.play().catch(e => console.log(e));
    }
  };

  const horrorLines = [
    t("hidden.line1"), t("hidden.line2"), t("hidden.line3"),
    t("hidden.line4"), t("hidden.line5"), t("hidden.line6")
  ];

  return (
    <>
      {/* الأزرار بتفضل زي ما هي fixed بالنسبة لمكان استدعاء المكون */}
      <button
        type="button"
        onClick={onSigilClick}
        className="fixed bottom-20 left-6 z-[55] h-9 w-9 rounded-full text-primary/30 transition hover:scale-125 hover:text-primary cursor-pointer"
      >
        𓆣
      </button>

      {unlocked && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            play("open", { pan: 0, volume: 0.7 });
            sounds.ancient.currentTime = 0;
            sounds.ancient.play().catch(e => console.log(e));
          }}
          className="fixed bottom-32 left-6 z-[55] rounded border border-primary/50 bg-card/85 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-primary backdrop-blur-md hover:shadow-gold cursor-pointer"
        >
          𓂀 {lang === "ar" ? "ادخل الحجرة السرية" : "ENTER HIDDEN CHAMBER"}
        </button>
      )}

      {/* 2. هنا نستخدم البورتال عشان المودال يخرج برا أي Stacking Context مزعج */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl pointer-events-auto"
          style={{ animation: "fadeIn 0.4s ease-out" }}
          onClick={() => {
            setOpen(false);
            sounds.ancient.pause();
          }}
        >
          <div
            className="relative max-w-xl w-[90%] border-2 border-gold bg-stone-950/95 p-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.3)] rounded-2xl"
            style={{ animation: "scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gold/50 hover:text-gold transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="h-8 w-8" />
            </button>

            <p className="font-display text-gold text-sm tracking-[0.5em] mb-6 drop-shadow-gold">
              𓂀 {lang === "ar" ? "حجرة الأسرار المحرمة" : "FORBIDDEN CHAMBER OF SECRETS"} 𓂀
            </p>

            <div className="space-y-4 text-gold/90 leading-relaxed mb-8 text-left border-y border-gold/20 py-6">
              {horrorLines.map((line, idx) => (
                <p key={idx} className="border-l-2 border-gold/30 pl-4 text-sm italic hover:border-gold transition-colors">
                  {line}
                </p>
              ))}
            </div>

            <button
              onClick={() => {
                openPharaohChat();
                setOpen(false);
              }}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gold/10 border border-gold px-8 py-3 font-display text-sm tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
            >
              <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
              {lang === "ar" ? "تحدث مع الكاهن" : "Summon the Priest"}
            </button>

            <p className="mt-8 text-[9px] tracking-[0.4em] text-gold/40 uppercase">
              — 𓋴 sealed by the order of thoth 𓋴 —
            </p>
          </div>
        </div>,
        document.body // 👈 ده اللي بيخليه يترندر في الـ root بتاع الصفحة
      )}
    </>
  );
};
