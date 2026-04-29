import { useLang } from "@/i18n/LanguageContext";
import { X } from "lucide-react";

interface SandstormWarningProps {
  onAccept: () => void;
  onReject: () => void;
}

export const SandstormWarning = ({ onAccept, onReject }: SandstormWarningProps) => {
  const { t } = useLang();

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-[100dvh] z-[9998] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto"
      data-cursor="native"
    >
      <div 
        className="relative max-w-lg w-full mx-4 p-6 border-4 border-gold rounded-xl shadow-2xl bg-stone-950/95 animate-reveal-up"
        style={{ boxShadow: "0 0 60px rgba(255, 215, 0, 0.7)" }}
      >
        <button 
          onClick={onReject}
          className="absolute top-3 right-3 text-gold/70 hover:text-gold transition"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <span className="text-7xl block mb-2 animate-pulse text-gold drop-shadow-[0_0_15px_gold]">𓂀</span>
          <h2 className="font-display text-2xl md:text-3xl text-gold tracking-wider drop-shadow-[0_0_10px_gold]">
            {t("sandstorm.title")}
          </h2>
          <div className="w-24 h-px bg-gold/50 mx-auto my-3" />
        </div>

        <p className="text-gold/90 text-lg leading-relaxed text-center font-serif drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">
          {t("sandstorm.message")}
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-gold/20 border-2 border-gold text-gold font-display tracking-widest hover:bg-gold hover:text-black transition-all duration-300 shadow-gold rounded-md"
          >
            {t("sandstorm.accept")}
          </button>
          <button
            onClick={onReject}
            className="px-6 py-2 bg-red-900/30 border-2 border-red-700 text-red-400 font-display tracking-widest hover:bg-red-800 hover:text-white transition-all duration-300 rounded-md"
          >
            {t("sandstorm.reject")}
          </button>
        </div>

        <p className="text-center text-gold/50 text-xs mt-6 tracking-wider">
          𓋴 𓎟 𓏙
        </p>
      </div>
    </div>
  );
};
