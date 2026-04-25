import { Moon, Sun } from "lucide-react";
import { sounds } from "src/audio.js"; // تأكد من مسار الاستيراد

export const ModeToggle = ({ mode, onToggle }: { mode: "night" | "day"; onToggle: () => void }) => {
  
  const handleClick = () => {
    onToggle(); // تنفيذ عملية التغيير الأصلية

    if (mode === "night") {
      // إحنا حالياً في ليل وهنروح للنهار
      if (sounds.night) sounds.night.pause();
      sounds.day.currentTime = 0;
      sounds.day.play().catch(e => console.log("Audio play blocked"));
    } else {
      // إحنا حالياً في نهار وهنروح لليل
      if (sounds.day) sounds.day.pause();
      sounds.night.currentTime = 0;
      sounds.night.play().catch(e => console.log("Audio play blocked"));
    }
  };

  return (
    <button onClick={handleClick}
      aria-label="Toggle day / night mode"
      className="fixed top-6 right-3 z-50 w-11 h-11 rounded-full gold-frame bg-card/80 backdrop-blur flex items-center justify-center text-primary hover:scale-110 transition-transform shadow-deep">
      {mode === "night" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
