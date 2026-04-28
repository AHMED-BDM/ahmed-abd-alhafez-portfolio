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
      // التحقق مما إذا كان المستخدم قد شاهد الرسالة في هذه الجلسة
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
      <div 
        className="relative max-w-lg w-full mx-4 p-6 border-4 border-primary/80 rounded-xl shadow-2xl bg-stone-900/95 animate-reveal-up"
        style={{ boxShadow: "0 0 50px rgba(210, 150, 50, 0.8)" }}
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-primary/70 hover:text-primary transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <span className="text-6xl block mb-2 animate-pulse">𓂀</span>
          <h2 className="font-display text-2xl md:text-3xl text-gold tracking-wider">
            {t("sandstorm.title")}
          </h2>
          <div className="w-24 h-px bg-primary/50 mx-auto my-3" />
        </div>

        <p className="text-foreground/90 text-lg leading-relaxed text-center font-serif">
          {t("sandstorm.message")}
        </p>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-primary/20 border-2 border-primary text-primary font-display tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-gold"
          >
            {t("sandstorm.button")}
          </button>
        </div>

        <p className="text-center text-primary/50 text-xs mt-6 tracking-wider">
          𓋴 𓎟 𓏙
        </p>
      </div>
    </div>
  );
};
