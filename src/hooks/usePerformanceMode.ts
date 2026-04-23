import { useEffect, useState } from "react";

const getReducedEffects = () => {
  if (typeof window === "undefined") return false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowMemory = "deviceMemory" in navigator && (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined
    ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4
    : false;
  const lowCpu = navigator.hardwareConcurrency <= 4;
  const smallScreen = window.innerWidth < 768;

  return prefersReducedMotion || (lowMemory && lowCpu) || (smallScreen && lowCpu);
};

export const usePerformanceMode = () => {
  const [reducedEffects, setReducedEffects] = useState(getReducedEffects);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedEffects(getReducedEffects());
    update();

    media.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return { reducedEffects };
};