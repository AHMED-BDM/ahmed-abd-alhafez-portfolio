import { SlidersHorizontal, Volume2, VolumeX } from "lucide-react";
import { useSound } from "./SoundContext";

type AtmosphereControlsProps = {
  intensity: "subtle" | "immersive";
  onIntensityToggle: () => void;
};

export const AtmosphereControls = ({ intensity, onIntensityToggle }: AtmosphereControlsProps) => {
  const { initialized, enabled, toggle, enableSound, play } = useSound();

  return (
    <div className="fixed bottom-5 left-5 z-[85] flex items-center gap-2 rounded-md border border-primary/30 bg-card/85 px-3 py-2 backdrop-blur-md shadow-deep cursor-auto pointer-events-auto">
      <button
        type="button"
        onClick={() => {
          if (!initialized) {
            enableSound();
            return;
          }

          toggle();
          play("click", { pan: -0.35, volume: 0.45 });
        }}
        className="flex min-w-[9rem] items-center justify-center gap-2 rounded-md border border-primary/30 bg-background/40 px-3 py-2 text-primary transition hover:border-primary hover:shadow-gold cursor-pointer"
        aria-label={!initialized ? "Enable ambient sound" : enabled ? "Mute ambient sound" : "Enable ambient sound"}
      >
        {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span className="text-[11px] font-display tracking-[0.18em]">{!initialized ? "ENABLE SOUND" : enabled ? "MUTE" : "UNMUTE"}</span>
      </button>

      <button
        type="button"
        onMouseEnter={() => play("hover", { pan: -0.2, volume: 0.45 })}
        onClick={onIntensityToggle}
        className="flex min-w-[8.5rem] items-center gap-2 rounded-md border border-primary/30 bg-background/40 px-3 py-2 text-xs font-display tracking-[0.2em] text-foreground/80 transition hover:border-primary hover:text-primary cursor-pointer"
        aria-label={`Effects intensity is ${intensity}`}
      >
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <span>{intensity === "immersive" ? "IMMERSIVE" : "SUBTLE"}</span>
      </button>
    </div>
  );
};