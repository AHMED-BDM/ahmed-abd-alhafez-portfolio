import { Moon, Sun } from "lucide-react";

export const ModeToggle = ({ mode, onToggle }: { mode: "night" | "day"; onToggle: () => void }) => (
  <button onClick={onToggle}
    aria-label="Toggle day / night mode"
    className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full gold-frame bg-card/80 backdrop-blur flex items-center justify-center text-primary hover:scale-110 transition-transform">
    {mode === "night" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);
