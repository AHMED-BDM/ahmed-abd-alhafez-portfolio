import { useEffect, useMemo, useState } from "react";
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

export const TempleAtmosphere = ({
  mode,
  intensity,
  reducedEffects,
}: {
  mode: "night" | "day";
  intensity: "subtle" | "immersive";
  reducedEffects: boolean;
}) => {
  const { enabled, play } = useSound();
  const [scrollProgress, setScrollProgress] = useState(0);
  const goldMotes = useMemo(() => createParticles(reducedEffects ? 10 : 22, [9, 18]), [reducedEffects]);
  const dustMotes = useMemo(() => createParticles(reducedEffects ? 14 : 30, [10, 22]), [reducedEffects]);
  const glyphs = useMemo(() => ["𓂀", "𓋹", "𓊃", "𓎼", "𓆣", "𓏏"], []);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(1, window.scrollY / max));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <div className="night-shadow-drift" />
          {!reducedEffects && <div className="night-shadow-figure" />}
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
          {!reducedEffects && (
            <div className="night-glow-eyes">
              <span />
              <span />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="day-storm-haze" style={{ opacity: 0.45 + scrollProgress * (intensity === "immersive" ? 0.4 : 0.22) }} />
          <div className="day-dust-band day-dust-band-a" />
          <div className="day-dust-band day-dust-band-b" />
          <div className="day-light-bloom" />
          {!reducedEffects && (
            <div className="day-hidden-glyphs" style={{ opacity: 0.08 + scrollProgress * 0.12 }}>
              {glyphs.map((glyph, index) => (
                <span key={glyph} style={{ left: `${8 + index * 14}%`, top: `${18 + (index % 2) * 22}%` }}>{glyph}</span>
              ))}
            </div>
          )}
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