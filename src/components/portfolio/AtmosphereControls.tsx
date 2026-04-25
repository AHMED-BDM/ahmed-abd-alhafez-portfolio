import { useSound } from "./SoundContext";

export const AtmosphereControls = () => {
  const { enabled, toggle } = useSound();

  return (
    <div className="fixed top-24 right-6 z-[75] flex flex-col items-center gap-3">
      <button
        onClick={toggle}
        aria-label={enabled ? "Mute sound" : "Enable sound"}
        className="w-11 h-11 rounded-full border-2 border-primary/60 bg-card/80 backdrop-blur text-primary hover:shadow-gold transition-all flex items-center justify-center font-display text-xl shadow-lg"
      >
        {enabled ? "𓂀" : "𓁹"}
        <span className="sr-only">{enabled ? "Sound on" : "Sound off"}</span>
      </button>
    </div>
  );
};
