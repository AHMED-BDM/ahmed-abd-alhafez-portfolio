import { Languages } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

export const LanguageToggle = () => {
  const { lang, toggle } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch language"
      className="fixed top-6 left-6 z-[80] flex items-center gap-2 rounded-full border-2 border-primary/60 bg-card/80 backdrop-blur px-3 py-2 text-primary hover:shadow-gold transition cursor-pointer pointer-events-auto"
      data-cursor="native"
    >
      <Languages className="h-4 w-4" />
      <span className="font-display text-[11px] tracking-[0.2em]">{lang === "en" ? "العربية" : "ENGLISH"}</span>
    </button>
  );
};