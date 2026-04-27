import { useEffect, useMemo, useRef } from "react";
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
  
  // Refs للتحكم في العناصر المعتمدة على الـ Scroll بدون Re-render
  const skyRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const glyphsRef = useRef<HTMLDivElement>(null);

  const goldMotes = useMemo(() => createParticles(reducedEffects ? 10 : 22, [9, 18]), [reducedEffects]);
  const dustMotes = useMemo(() => createParticles(reducedEffects ? 30 : 80, [6, 14]), [reducedEffects]);
  const sandStreaks = useMemo(() => createParticles(reducedEffects ? 8 : 18, [4, 9]), [reducedEffects]);
  const glyphs = useMemo(() => ["𓂀", "𓋹", "𓊃", "𓎼", "𓆣", "𓏏"], []);

  useEffect(() => {
    const onScroll = () => {
      requestAnimationFrame(() => {
        const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(1, window.scrollY / max);

        // تحديث الـ DOM مباشرة
        if (skyRef.current) skyRef.current.style.opacity = `${0.6 + progress * (intensity === "immersive" ? 0.35 : 0.2)}`;
        if (hazeRef.current) hazeRef.current.style.opacity = `${0.55 + progress * (intensity === "immersive" ? 0.4 : 0.22)}`;
        if (glyphsRef.current) glyphsRef.current.style.opacity = `${0.08 + progress * 0.12}`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [intensity]);

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
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden transform-gpu">
      {mode === "night" ? (
        <>
          <div className="night-gold-sheen" />
          <div className="night-gold-vignette" />
          <div className="night-shadow-drift" />
          {!reducedEffects && <div className="night-shadow-figure" />}
          {goldMotes.map((mote) => (
            <span
              key={mote.id}
              className="night-gold-mote transform-gpu will-change-transform"
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
          <div ref={skyRef} className="day-sand-sky transform-gpu will-change-[opacity]" />
          <div ref={hazeRef} className="day-storm-haze transform-gpu will-change-[opacity]" />
          <div className="day-dust-band day-dust-band-a" />
          <div className="day-dust-band day-dust-band-b" />
          <div className="day-dust-band day-dust-band-c" />
          <div className="day-sand-sweep" />
          <div className="day-light-bloom" />
          {!reducedEffects && (
            <div ref={glyphsRef} className="day-hidden-glyphs transform-gpu will-change-[opacity]">
              {glyphs.map((glyph, index) => (
                <span key={glyph} style={{ left: `${8 + index * 14}%`, top: `${18 + (index % 2) * 22}%` }}>{glyph}</span>
              ))}
            </div>
          )}
          {dustMotes.map((mote) => (
            <span
              key={mote.id}
              className="day-dust-mote transform-gpu will-change-transform"
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
          {sandStreaks.map((streak) => (
            <span
              key={`streak-${streak.id}`}
              className="day-sand-streak transform-gpu will-change-transform"
              style={{
                left: streak.left,
                top: streak.top,
                animationDuration: streak.duration,
                animationDelay: streak.delay,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
