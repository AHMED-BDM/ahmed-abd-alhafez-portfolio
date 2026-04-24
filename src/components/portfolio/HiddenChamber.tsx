import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useSound } from "./SoundContext";

export const HiddenChamber = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const clicksRef = useRef<number[]>([]);
  const { play } = useSound();

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      if (window.scrollY / max > 0.92 && !unlocked) {
        setUnlocked(true);
        console.log("[HiddenChamber] Unlocked via deep scroll");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [unlocked]);

  const onSigilClick = () => {
    const now = Date.now();
    clicksRef.current = clicksRef.current.filter((t) => now - t < 2500);
    clicksRef.current.push(now);
    play("hover", { pan: 0.1, volume: 0.6 });
    if (clicksRef.current.length >= 3) {
      clicksRef.current = [];
      setUnlocked(true);
      setOpen(true);
      play("open", { pan: 0, volume: 0.7 });
      console.log("[HiddenChamber] Unlocked via sigil triple-click");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onSigilClick}
        aria-label="Ancient sigil"
        className="fixed bottom-20 left-6 z-[55] h-9 w-9 rounded-full text-primary/30 transition hover:scale-125 hover:text-primary cursor-pointer"
        style={{ textShadow: "0 0 10px hsl(var(--primary) / 0.5)" }}
      >
        𓆣
      </button>

      {unlocked && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            play("open", { pan: 0, volume: 0.7 });
          }}
          className="fixed bottom-32 left-6 z-[55] rounded border border-primary/50 bg-card/85 px-3 py-1.5 font-display text-[10px] tracking-[0.25em] text-primary backdrop-blur-md hover:shadow-gold cursor-pointer pointer-events-auto"
        >
          𓂀 ENTER CHAMBER
        </button>
      )}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[96] flex items-center justify-center bg-background/95 p-4 backdrop-blur-md cursor-auto pointer-events-auto"
          style={{ animation: "fadeIn 0.5s ease-out" }}
          data-cursor="native"
        >
          <button
            className="absolute top-6 right-6 z-10 text-primary cursor-pointer"
            aria-label="Close hidden chamber"
            onClick={() => setOpen(false)}
            data-cursor="native"
          >
            <X className="h-7 w-7" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-xl w-full rounded-md border-2 border-primary/40 bg-card/90 p-8 text-center shadow-deep cursor-auto pointer-events-auto"
            style={{ animation: "scale-in 0.6s ease-out" }}
            data-cursor="native"
          >
            <p className="font-display text-primary text-xs tracking-[0.4em] mb-4">𓋹 HIDDEN CHAMBER 𓋹</p>
            <h3 className="font-display text-2xl md:text-3xl text-gold mb-4">A Secret Forged in Silence</h3>
            <p className="text-foreground/80 italic leading-7 mb-6">
              "Beyond the recorded scrolls lies an unfinished work — a neural oracle trained on
              forgotten dialects. Its name is yet unspoken, its weights yet unsealed."
            </p>
            <p className="text-sm text-foreground/60">
              You found this chamber because you looked closer than most. The Pharaoh remembers.
            </p>
            <p className="mt-6 text-[10px] tracking-[0.3em] text-primary/70">— 𓂀 SEALED · STAGE · IV 𓂀 —</p>
          </div>
        </div>
      )}
    </>
  );
};
