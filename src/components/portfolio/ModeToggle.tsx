import { Moon, Sun } from "lucide-react";
import { sounds } from "@/audio"; // تأكد من المسار

export const ModeToggle = ({ mode, onToggle }: { mode: "night" | "day"; onToggle: () => void }) => {
  
  const handleClick = () => {
    // تشغيل التغيير في الواجهة
    onToggle();

    // التحكم في الصوت
    if (mode === "night") {
      // إذا كان ليل وضغطنا، ننتقل للنهار
      sounds.night.pause();
      sounds.day.currentTime = 0;
      sounds.day.play().catch(e => console.log("Audio blocked by browser"));
    } else {
      // إذا كان نهار وضغطنا، ننتقل لليل
      sounds.day.pause();
      sounds.night.currentTime = 0;
      sounds.night.play().catch(e => console.log("Audio blocked by browser"));
    }
  };

  return (
    <button 
      onClick={handleClick}
      aria-label="Toggle day / night mode"
      className="fixed top-6 right-3 z-50 w-11 h-11 rounded-full gold-frame bg-card/80 backdrop-blur flex items-center justify-center text-primary hover:scale-110 transition-transform shadow-deep"
    >
      {mode === "night" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
