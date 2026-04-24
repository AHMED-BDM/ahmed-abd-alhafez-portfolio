import { Code2, Sparkles } from "lucide-react";

export const DevModeToggle = ({
  devMode,
  onToggle,
}: {
  devMode: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    aria-label="Toggle developer mode"
    data-cursor="native"
    className="fixed top-6 right-24 z-50 h-12 px-4 rounded-full gold-frame bg-card/80 backdrop-blur flex items-center gap-2 text-primary hover:scale-105 transition-transform"
  >
    {devMode ? <Sparkles className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
    <span className="text-[10px] tracking-[0.25em] hidden sm:inline">
      {devMode ? "TEMPLE" : "رؤية المطور"}
    </span>
  </button>
);