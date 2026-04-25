import { Code2, Sparkles } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";

export const DevModeToggle = ({
  devMode,
  onToggle,
}: {
  devMode: boolean;
  onToggle: () => void;
}) => {
  const { lang } = useLang();
  const label = devMode
    ? lang === "ar" ? "المعبد" : "TEMPLE"
    : lang === "ar" ? "رؤية المطور" : "DEV VIEW";
  return (
  <button
    onClick={onToggle}
    aria-label="Toggle developer mode"
    data-cursor="native"
    className="fixed top-20 right-3 z-50 h-11 px-3 rounded-full gold-frame bg-card/80 backdrop-blur flex items-center gap-2 text-primary hover:scale-105 transition-transform shadow-deep"
  >
    {devMode ? <Sparkles className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
    <span className="text-[10px] tracking-[0.25em] hidden sm:inline">
      {label}
    </span>
  </button>
  );
};