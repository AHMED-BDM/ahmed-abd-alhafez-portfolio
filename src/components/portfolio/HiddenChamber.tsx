import { useEffect, useRef, useState } from "react";
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
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (window.scrollY / max > 0.92 && !unlocked) {
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
      setOpen(true);
      play("open", { pan: 0, volume: 0.7 });
      sounds.ancient.currentTime = 0;
      sounds.ancient.play().catch(e => console.log(e));
    }
  };

  const horrorLines = [
    t("hidden.line1"),
    t("hidden.line2"),
    t("hidden.line3"),
    t("hidden.line4"),
    t("hidden.line5"),
    t("hidden.line6")
  ];

  return (
    <>
      <button
        type="button"
        onClick={onSigilClick}
        aria-label="Ancient sigil"
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

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto"
          style={{ animation: "fadeIn 0.3s ease-out" }}
          onClick={() => {
            setOpen(false);
            sounds.ancient.pause();
            sounds.ancient.currentTime = 0;
          }}
          data-cursor="native"
        >
          <div
            className="relative max-w-xl w-full mx-4 border-2 border-gold bg-stone-950/95 p-6 text-center shadow-2xl rounded-xl"
            style={{ animation: "scale-in 0.3s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gold/70 hover:text-gold transition"
              onClick={() => {
                setOpen(false);
                sounds.ancient.pause();
                sounds.ancient.currentTime = 0;
              }}
            >
              <X className="h-6 w-6" />
            </button>

            <p className="font-display text-gold text-xs tracking-[0.4em] mb-4 drop-shadow-gold">
              𓂀 {lang === "ar" ? "حجرة الأسرار المحرمة" : "FORBIDDEN CHAMBER OF SECRETS"} 𓂀
            </p>

            <div className="space-y-3 text-gold/90 leading-relaxed mb-6 text-left drop-shadow-gold">
              {horrorLines.map((line, idx) => (
                <p key={idx} className="border-l-2 border-gold/50 pl-4 text-sm italic">
                  {line}
                </p>
              ))}
            </div>

            <button
              onClick={() => {
                openPharaohChat();
                setOpen(false);
                sounds.ancient.pause();
                sounds.ancient.currentTime = 0;
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-md bg-gold/20 border border-gold px-4 py-2 font-display text-sm tracking-wider text-gold transition hover:bg-gold hover:text-black shadow-gold"
            >
              <MessageSquare className="h-4 w-4" />
              {lang === "ar" ? "توجه إلى شات الفرعون" : "Go to Pharaoh's Chat"}
            </button>

            <p className="mt-6 text-[10px] tracking-[0.3em] text-gold/50">
              — 𓋴 SEALED BY THE SCRIBE OF THOTH 𓋴 —
            </p>
          </div>
        </div>
      )}
    </>
  );
};
