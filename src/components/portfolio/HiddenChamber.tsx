import { useEffect, useRef, useState } from "react";
import { X, MessageSquare } from "lucide-react";
import { useSound } from "./SoundContext";
import { useLang } from "@/i18n/LanguageContext";
import { sounds } from "../../audio";

// استدعاء دالة لفتح شات الفرعون (سنقوم بتعريفها لاحقًا)
// سنفترض وجود معرف أو حدث عام يمكن استدعاؤه لفتح الشات
const openPharaohChat = () => {
  // نبحث عن عنصر الشات أو نرسل حدث مخصص
  const chatButton = document.querySelector('[data-pharaoh-chat-trigger]') as HTMLElement;
  if (chatButton) {
    chatButton.click();
  } else {
    // بديل: ننشئ حدث مخصص يمكن لأي مكون الاستماع إليه
    window.dispatchEvent(new CustomEvent("openPharaohChat"));
  }
};

export const HiddenChamber = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const clicksRef = useRef<number[]>([]);
  const { play } = useSound();
  const { t, lang } = useLang(); // lang لتحديد اللغة إذا احتجنا

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (window.scrollY / max > 0.92 && !unlocked) {
        setUnlocked(true);
        console.log("[HiddenChamber] Unlocked via deep scroll");
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
      console.log("[HiddenChamber] Unlocked via sigil triple-click");
    }
  };

  // الأسطر الستة المخيفة (تؤخذ من الترجمة)
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
      {/* الختم السري (الجعران) */}
      <button
        type="button"
        onClick={onSigilClick}
        aria-label="Ancient sigil"
        className="fixed bottom-20 left-6 z-[55] h-9 w-9 rounded-full text-primary/30 transition hover:scale-125 hover:text-primary cursor-pointer"
        style={{ textShadow: "0 0 10px hsl(var(--primary) / 0.5)" }}
      >
        𓆣
      </button>

      {/* إشعار فتح الغرفة (يظهر في الأسفل بجوار الختم) */}
      {unlocked && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            play("open", { pan: 0, volume: 0.7 });
            sounds.ancient.currentTime = 0;
            sounds.ancient.play().catch(e => console.log(e));
          }}
          className="fixed bottom-32 left-6 z-[55] rounded border border-primary/50 bg-card/85 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-primary backdrop-blur-md hover:shadow-gold cursor-pointer pointer-events-auto"
        >
          𓂀 {lang === "ar" ? "ادخل الحجرة السرية" : "ENTER HIDDEN CHAMBER"}
        </button>
      )}

      {/* نافذة الغرفة السرية (6 أسطر + رابط للشات) */}
      {open && (
        <div
          onClick={() => {
            setOpen(false);
            sounds.ancient.pause();
            sounds.ancient.currentTime = 0;
          }}
          className="fixed inset-0 z-[96] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-auto pointer-events-auto"
          style={{ animation: "fadeIn 0.5s ease-out" }}
          data-cursor="native"
        >
          <button
            className="absolute top-6 right-6 z-10 text-primary cursor-pointer"
            aria-label="Close hidden chamber"
            onClick={() => {
              setOpen(false);
              sounds.ancient.pause();
              sounds.ancient.currentTime = 0;
            }}
            data-cursor="native"
          >
            <X className="h-7 w-7" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full rounded-md border-2 border-primary/60 bg-stone-950/90 p-8 text-center shadow-2xl backdrop-blur-sm"
            style={{ animation: "scale-in 0.6s ease-out" }}
            data-cursor="native"
          >
            {/* عنوان مخيف */}
            <p className="font-display text-primary text-xs tracking-[0.4em] mb-4">
              𓂀 {lang === "ar" ? "حجرة الأسرار المحرمة" : "FORBIDDEN CHAMBER OF SECRETS"} 𓂀
            </p>

            {/* الأسطر الستة */}
            <div className="space-y-3 text-foreground/90 leading-relaxed mb-6 text-left">
              {horrorLines.map((line, idx) => (
                <p key={idx} className="border-l-2 border-primary/30 pl-4 text-sm italic">
                  {line}
                </p>
              ))}
            </div>

            {/* الزر الذي يوجه إلى شات الفرعون */}
            <button
              onClick={() => {
                openPharaohChat();
                setOpen(false); // إغلاق الغرفة بعد التوجيه
                sounds.ancient.pause();
                sounds.ancient.currentTime = 0;
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary/20 px-4 py-2 font-display text-sm tracking-wider text-primary transition hover:bg-primary/40 hover:shadow-gold"
            >
              <MessageSquare className="h-4 w-4" />
              {lang === "ar" ? "توجه إلى شات الفرعون" : "Go to Pharaoh's Chat"}
            </button>

            <p className="mt-6 text-[10px] tracking-[0.3em] text-primary/50">
              — 𓋴 SEALED BY THE SCRIBE OF THOTH 𓋴 —
            </p>
          </div>
        </div>
      )}
    </>
  );
};
