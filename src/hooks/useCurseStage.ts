import { useEffect, useRef, useState } from "react";

const VISIT_KEY = "temple-return-count";
const LAST_VISIT_KEY = "temple-last-visit";

export type CurseStage = 1 | 2 | 3 | 4;

export const useCurseStage = () => {
  const [stage, setStage] = useState<CurseStage>(1);
  const [isReturning, setIsReturning] = useState(false);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const visits = Number(window.localStorage.getItem(VISIT_KEY) ?? "0");
    const returning = visits > 0;
    setIsReturning(returning);
    if (returning) {
      console.log(`[Curse] User returning — visit #${visits + 1}`);
      setStage(2);
    } else {
      console.log("[Curse] First visit — stage 1");
    }
    window.localStorage.setItem(LAST_VISIT_KEY, String(Date.now()));
  }, []);

  useEffect(() => {
    const baseOffset = isReturning ? -45_000 : 0;
    const t1 = window.setTimeout(() => {
      setStage((s) => (s < 2 ? 2 : s));
      console.log("[Curse] Stage 2 — subtle whispers");
    }, Math.max(15_000, 60_000 + baseOffset));
    const t2 = window.setTimeout(() => {
      setStage((s) => (s < 3 ? 3 : s));
      console.log("[Curse] Stage 3 — visual glitches");
    }, Math.max(60_000, 150_000 + baseOffset));
    const t3 = window.setTimeout(() => {
      setStage(4);
      console.log("[Curse] Stage 4 — direct messages");
    }, Math.max(120_000, 260_000 + baseOffset));

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isReturning]);

  return { stage, isReturning, sessionStartedAt: startRef.current };
};
