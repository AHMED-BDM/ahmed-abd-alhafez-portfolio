import { useEffect, useMemo, useRef, useState } from "react";
import { useCurseStage } from "@/hooks/useCurseStage";
import { useLang } from "@/i18n/LanguageContext";

export const FourthWall = ({ reducedEffects }: { reducedEffects: boolean }) => {
  const { stage, isReturning } = useCurseStage();
  const { t } = useLang();
  const RETURNING_MESSAGES = useMemo(() => [t("fw.return1"), t("fw.return2"), t("fw.return3")], [t]);
  const LONG_STAY_MESSAGES = useMemo(() => [t("fw.long1"), t("fw.long2")], [t]);
  const STAGE4_MESSAGES = useMemo(() => [t("fw.s4_1"), t("fw.s4_2"), t("fw.long2")], [t]);
  const [message, setMessage] = useState<string | null>(null);
  const lastShownRef = useRef(0);
  const moveCountRef = useRef(0);
  const greetedRef = useRef(false);

  useEffect(() => {
    if (reducedEffects) return;
    if (isReturning && !greetedRef.current) {
      greetedRef.current = true;
      const greet = RETURNING_MESSAGES[Math.floor(Math.random() * RETURNING_MESSAGES.length)];
      window.setTimeout(() => {
        setMessage(greet);
        window.setTimeout(() => setMessage(null), 4200);
      }, 6000);
    }
  }, [isReturning, reducedEffects]);

  useEffect(() => {
    if (reducedEffects || stage < 2) return;

    const onMove = () => {
      moveCountRef.current += 1;
      const now = Date.now();
      if (now - lastShownRef.current < 35_000) return;

      const trigger = stage >= 3 ? 80 : 160;
      if (moveCountRef.current % trigger === 0 && Math.random() < 0.4) {
        lastShownRef.current = now;
        const pool = stage >= 4 ? STAGE4_MESSAGES : LONG_STAY_MESSAGES;
        setMessage(pool[Math.floor(Math.random() * pool.length)]);
        window.setTimeout(() => setMessage(null), 3800);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedEffects, stage]);

  if (!message) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-1/3 z-[88] flex justify-center px-6"
    >
      <p
        className="font-display text-primary text-lg md:text-2xl tracking-[0.25em] text-center"
        style={{
          textShadow: "0 0 30px hsl(42 95% 55% / 0.7), 0 0 60px hsl(8 65% 30% / 0.4)",
          animation: "fadeIn 0.6s ease-out, fadeOut 0.6s ease-in 3.2s forwards",
        }}
      >
        {message}
      </p>
    </div>
  );
};
