import { useEffect, useState } from "react";

export interface VisionZone {
  x: number;
  y: number;
  active: boolean;
}

const TEXT_SELECTOR =
  "p, h1, h2, h3, h4, h5, h6, li, a, button, label, input, textarea, span.readable, [data-readable]";

export const useReadabilityZone = (enabled: boolean) => {
  const [zone, setZone] = useState<VisionZone>({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!enabled) {
      setZone((z) => ({ ...z, active: false }));
      return;
    }
    let raf = 0;
    let pending: { x: number; y: number; over: boolean } | null = null;

    const flush = () => {
      raf = 0;
      if (!pending) return;
      setZone({ x: pending.x, y: pending.y, active: pending.over });
      pending = null;
    };

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const over = Boolean(target?.closest(TEXT_SELECTOR));
      pending = { x: e.clientX, y: e.clientY, over };
      if (!raf) raf = requestAnimationFrame(flush);
    };

    const onLeave = () => setZone((z) => ({ ...z, active: false }));

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return zone;
};