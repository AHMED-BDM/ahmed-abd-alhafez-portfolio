import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { X } from "lucide-react";

interface SandstormWarningProps {
  mode: "day" | "night";
  onAcknowledge: () => void;
}

export const SandstormWarning = ({ mode, onAcknowledge }: SandstormWarningProps) => {
  const { t, lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (mode === "day") {
      const hasSeen = sessionStorage.getItem("sandstorm_warning_seen");
      if (!hasSeen) {
        setIsOpen(true);
      }
    } else {
      setIsOpen(false);
    }
  }, [mode]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("sandstorm_warning_seen", "true");
    onAcknowledge();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
      <div 
        className="relative max-w-lg w-full mx-4 p-6 border-4 border-gold rounded-xl shadow-2xl bg-stone-950/95 animate-reveal-up"
        style={{ boxShadow: "0 0 50px rgba(255, 215, 0, 0.6)" }}
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-gold/70 hover:text-gold transition"
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

        <div className="flex justify-center mt-8">
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-gold/20 border-2 border-gold text-gold font-display tracking-widest hover:bg-gold hover:text-black transition-all duration-300 shadow-gold rounded-md"
          >
            {t("sandstorm.button")}
          </button>
        </div>

        <p className="text-center text-gold/50 text-xs mt-6 tracking-wider">
          𓋴 𓎟 𓏙
        </p>
      </div>
    </div>
  );
};
