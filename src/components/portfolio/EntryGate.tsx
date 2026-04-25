import { useEffect, useState } from "react";
import gateImg from "@/assets/gate-door.jpg";

export const EntryGate = ({ onEnter }: { onEnter: () => void }) => {
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [armed, setArmed] = useState(false);

  // Trigger gate open + horror sound only after a user gesture (browsers block autoplay otherwise)
  const playGateSound = () => {
    try {
      const AC = (window as Window & { webkitAudioContext?: typeof AudioContext }).AudioContext
        || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const now = ac.currentTime;
      const master = ac.createGain();
      master.gain.value = 0.7;
      master.connect(ac.destination);

      // 1) Deep ominous drone (sub-bass)
      const drone = ac.createOscillator();
      drone.type = "sawtooth";
      drone.frequency.setValueAtTime(48, now);
      drone.frequency.exponentialRampToValueAtTime(36, now + 2.4);
      const droneGain = ac.createGain();
      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.exponentialRampToValueAtTime(0.35, now + 0.6);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);
      drone.connect(droneGain).connect(master);
      drone.start(now); drone.stop(now + 2.7);

      // 2) Heavy stone-grinding noise
      const buf = ac.createBuffer(1, ac.sampleRate * 2.4, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        const t = i / d.length;
        d[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(t * 30)) * (1 - t * 0.6);
      }
      const noise = ac.createBufferSource();
      noise.buffer = buf;
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(220, now);
      lp.frequency.linearRampToValueAtTime(800, now + 1.8);
      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.55, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
      noise.connect(lp).connect(noiseGain).connect(master);
      noise.start(now); noise.stop(now + 2.4);

      // 3) Distant cursed whisper-chord
      [110, 138.6, 164.8].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.06, now + 1 + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3);
        o.connect(g).connect(master);
        o.start(now); o.stop(now + 3.1);
      });

      // 4) Final thud / boom when fully open
      setTimeout(() => {
        const t2 = ac.currentTime;
        const thud = ac.createOscillator();
        thud.type = "sine";
        thud.frequency.setValueAtTime(90, t2);
        thud.frequency.exponentialRampToValueAtTime(28, t2 + 0.6);
        const thudG = ac.createGain();
        thudG.gain.setValueAtTime(0.6, t2);
        thudG.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.7);
        thud.connect(thudG).connect(master);
        thud.start(t2); thud.stop(t2 + 0.75);
      }, 2200);
    } catch {
      /* audio unavailable */
    }
  };

  const beginEntry = () => {
    if (armed) return;
    setArmed(true);
    playGateSound();
    setTimeout(() => setOpening(true), 250);
    setTimeout(() => { setHidden(true); onEnter(); }, 3000);
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-hidden flex items-center justify-center">
      {/* light beam */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-primary blur-md opacity-90 torch-flicker" />
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(ellipse at center, hsl(var(--primary)/0.25), transparent 60%)" }} />

      {/* dust particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="absolute w-1 h-1 rounded-full bg-primary/60 float-slow"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*4}s` }} />
      ))}

      {/* doors */}
      <div className="absolute inset-0 flex" style={{ perspective: "1500px" }}>
        <div className={`w-1/2 h-full bg-cover bg-right shadow-deep ${opening ? "gate-open-left" : ""}`}
             style={{ backgroundImage: `url(${gateImg})`, transformOrigin: "left center" }} />
        <div className={`w-1/2 h-full bg-cover bg-left shadow-deep ${opening ? "gate-open-right" : ""}`}
             style={{ backgroundImage: `url(${gateImg})`, backgroundPositionX: "-100%", transformOrigin: "right center" }} />
      </div>

      <button onClick={() => { setHidden(true); onEnter(); }}
        className="absolute bottom-8 right-8 z-10 text-xs font-display tracking-widest text-primary/70 hover:text-primary transition">
        SKIP ›
      </button>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center flex flex-col items-center gap-4">
        {!armed ? (
          <button onClick={beginEntry}
            className="group px-8 py-3 border-2 border-primary bg-background/80 backdrop-blur text-primary font-display text-sm tracking-[0.4em] hover:bg-primary hover:text-primary-foreground transition shadow-gold torch-flicker">
            𓂀 OPEN · THE · GATE 𓂀
          </button>
        ) : (
          <p className="font-display text-primary text-sm tracking-[0.4em] torch-flicker">ENTER · THE · TEMPLE</p>
        )}
      </div>
    </div>
  );
};
