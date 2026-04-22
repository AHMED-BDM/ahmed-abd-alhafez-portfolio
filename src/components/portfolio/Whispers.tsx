import { useEffect } from "react";
import { useSound } from "./SoundContext";

export const Whispers = () => {
  const { enabled, play } = useSound();
  useEffect(() => {
    if (!enabled) return;
    let lastInteraction = Date.now();
    const mark = () => { lastInteraction = Date.now(); };
    window.addEventListener("mousemove", mark);
    window.addEventListener("click", mark);
    const id = setInterval(() => {
      const idle = Date.now() - lastInteraction > 12000;
      if ((idle && Math.random() < 0.4) || Math.random() < 0.05) play("whisper");
    }, 18000);
    return () => {
      clearInterval(id);
      window.removeEventListener("mousemove", mark);
      window.removeEventListener("click", mark);
    };
  }, [enabled, play]);
  return null;
};