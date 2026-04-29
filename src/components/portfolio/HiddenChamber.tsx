import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; 
import { X, MessageSquare } from "lucide-react";
import { useSound } from "./SoundContext"; 
import { useLang } from "@/i18n/LanguageContext";

// --- إعداد الصوت يدوياً ---
const ancientAudio = typeof Audio !== "undefined" 
  ? new Audio("/audio/Ancient-Egyptian-Language.mp3") 
  : null;

const openPharaohChat = () => {
  const chatButton = document.querySelector('[data-pharaoh-chat-trigger]') as HTMLElement;
  if (chatButton) chatButton.click();
  else window.dispatchEvent(new CustomEvent("openPharaohChat"));
};

export const HiddenChamber = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { play } = useSound();
  const { t, lang } = useLang();

  useEffect(() => {
    setMounted(true);
  }, []);

  // الحجرة تفتح فقط عند الوصول لنهاية الصفحة (مكافأة للقارئ المجتهد)
  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      if (scrollHeight <= windowHeight) return;
      const max = scrollHeight - windowHeight;
      const scrolled = window.scrollY / max;
      
      // إذا وصل المستخدم لـ 92% من الصفحة تظهر له الحجرة
      if (scrolled > 0.92 && !unlocked && window.scrollY > 30) {
        setUnlocked(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [unlocked]);

  const horrorLines = [
    t("hidden.line1"), t("hidden.line2"), t("hidden.line3"),
    t("hidden.line4"), t("hidden.line5"), t("hidden.line6")
  ];

  if (!mounted) return null;

  return (
    <>
      {/* تم حذف زرار الحشرة (𓆣) نهائياً من هنا */}

      {unlocked && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            play("open", { pan: 0, volume: 0.7 });
            if (ancientAudio) ancientAudio.play().catch(() => {});
          }}
          className="fixed bottom-32 left-6 z-[55] rounded border border-gold/50 bg-stone-900/90 px-4 py-2 font-display text-[10px] tracking-[0.25em] text-gold backdrop-blur-md hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all animate-pulse cursor-pointer"
        >
          𓂀 {lang === "ar" ? "ادخل الحجرة السرية" : "ENTER HIDDEN CHAMBER"}
        </button>
      )}

      {open && createPortal(
        <div
          className="fixed top-0 left-0 w-screen h-[100dvh] z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl pointer-events-auto"
          style={{ animation: "hiddenFadeIn 0.5s ease-out forwards" }}
          onClick={() => {
            setOpen(false);
            if (ancientAudio) ancientAudio.pause();
          }}
        >
          <div
            className="relative max-w-xl w-[92%] border-2 border-gold/50 bg-stone-950 p-8 text-center shadow-[0_0_100px_rgba(0,0,0,1)] rounded-2xl overflow-hidden"
            style={{ animation: "hiddenScaleIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none text-[10rem] flex items-center justify-center">𓁹</div>

            <button
              className="absolute top-4 right-4 text-gold/40 hover:text-gold transition-colors p-2 z-10"
              onClick={() => {
                setOpen(false);
                if (ancientAudio) ancientAudio.pause();
              }}
            >
              <X className="h-6 w-6" />
            </button>

            <p className="font-display text-gold text-sm tracking-[0.5em] mb-8 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
              𓂀 {lang === "ar" ? "حجرة الأسرار المحرمة" : "FORBIDDEN CHAMBER OF SECRETS"} 𓂀
            </p>

            <div className="space-y-5 text-gold/80 leading-relaxed mb-10 text-left border-y border-gold/10 py-8">
              {horrorLines.map((line, idx) => (
                <p key={idx} className="border-l-2 border-gold/20 pl-5 text-sm italic hover:text-gold transition-colors duration-500">
                  {line}
                </p>
              ))}
            </div>

            <button
              onClick={() => {
                openPharaohChat();
                setOpen(false);
                if (ancientAudio) ancientAudio.pause();
              }}
              className="group relative inline-flex items-center gap-3 rounded-full bg-gold/5 border border-gold/40 px-10 py-4 font-display text-xs tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-black hover:scale-105"
            >
              <MessageSquare className="h-4 w-4" />
              {lang === "ar" ? "استدعِ الكاهن" : "SUMMON THE PRIEST"}
            </button>

            <p className="mt-10 text-[8px] tracking-[0.5em] text-gold/30 uppercase">
                    — 𓋴 {t("footer.sealed")} 𓋴 —
            </p>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes hiddenFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes hiddenScaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
};
