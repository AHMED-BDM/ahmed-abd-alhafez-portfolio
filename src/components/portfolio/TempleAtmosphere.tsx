import { useEffect, useMemo } from "react";
import { useSound } from "./SoundContext";

const createParticles = (count: number, speed: [number, number]) =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${8 + Math.random() * 18}px`,
    duration: `${speed[0] + Math.random() * (speed[1] - speed[0])}s`,
    delay: `${Math.random() * 8}s`,
    driftX: `${-40 + Math.random() * 80}px`,
    driftY: `${-24 - Math.random() * 80}px`,
  }));

export const TempleAtmosphere = ({ mode }: { mode: "night" | "day" }) => {
  const { enabled, play } = useSound();
  const goldMotes = useMemo(() => createParticles(22, [9, 18]), []);
  const dustMotes = useMemo(() => createParticles(30, [10, 22]), []);

  useEffect(() => {
    if (!enabled) return;

    const id = window.setInterval(() => {
      const pan = Math.random() * 1.2 - 0.6;
      if (mode === "night" && Math.random() < 0.45) play("glint", { pan, volume: 0.7 });
      if (mode === "day" && Math.random() < 0.55) play("gust", { pan, volume: 0.7 });
    }, mode === "night" ? 16000 : 14000);

    return () => window.clearInterval(id);
  }, [enabled, mode, play]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {mode === "night" ? (
        <>
          <div className="night-gold-sheen" />
          <div className="night-gold-vignette" />
          {goldMotes.map((mote) => (
            <span
              key={mote.id}
              className="night-gold-mote"
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
                animationDuration: mote.duration,
                animationDelay: mote.delay,
                ["--drift-x" as string]: mote.driftX,
                ["--drift-y" as string]: mote.driftY,
              }}
            />
          ))}
        </>
      ) : (
        <>
          <div className="day-storm-haze" />
          <div className="day-dust-band day-dust-band-a" />
          <div className="day-dust-band day-dust-band-b" />
          <div className="day-light-bloom" />
          {dustMotes.map((mote) => (
            <span
              key={mote.id}
              className="day-dust-mote"
              style={{
                left: mote.left,
                top: mote.top,
                width: mote.size,
                height: mote.size,
                animationDuration: mote.duration,
                animationDelay: mote.delay,
                ["--drift-x" as string]: mote.driftX,
                ["--drift-y" as string]: mote.driftY,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};