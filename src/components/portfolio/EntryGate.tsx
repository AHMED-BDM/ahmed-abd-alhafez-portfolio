import { useEffect, useState } from "react";
import gateImg from "@/assets/gate-door.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { DustEffect } from "./DustEffect"; // ✅ استدعاء الغبار

export const EntryGate = ({ onEnter }: { onEnter: () => void }) => {
  const { t } = useLang();
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [armed, setArmed] = useState(false);

  const playGateSound = () => {
    try {
      const w = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
      const AC = w.AudioContext || w.webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const now = ac.currentTime;
      const master = ac.createGain();
      master.gain.value = 0.7;
      master.connect(ac.destination);

      // 1) Deep ominous drone
      const drone = ac.createOscillator();
      drone.type = "sawtooth";
      drone.frequency.setValueAtTime(48, now);
      drone.frequency.exponentialRampToValueAtTime(36, now + 4.8); // طولنا الصوت ليتناسب مع الـ 5 ثواني
      const droneGain = ac.createGain();
      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.exponentialRampToValueAtTime(0.35, now + 1.0);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
      drone.connect(droneGain).connect(master);
      drone.start(now); drone.stop(now + 5.1);

      // 2) Heavy stone-grinding noise
      const buf = ac.createBuffer(1, ac.sampleRate * 5.0, ac.sampleRate);
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
      lp.frequency.linearRampToValueAtTime(800, now + 3.0);
      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.55, now + 1.0);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
      noise.connect(lp).connect(noiseGain).connect(master);
      noise.start(now); noise.stop(now + 5.0);

      // 3) Distant cursed whisper-chord
      [110, 138.6, 164.8].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.06, now + 1 + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
        o.connect(g).connect(master);
        o.start(now); o.stop(now + 4.6);
      });

      // 4) Final thud / boom when fully open
      setTimeout(() => {
        const t2 = ac.currentTime;
        const thud = ac.createOscillator();
        thud.type = "sine";
        thud.frequency.setValueAtTime(90, t2);
        thud.frequency.exponentialRampToValueAtTime(28, t2 + 1.0);
        const thudG = ac.createGain();
        thudG.gain.setValueAtTime(0.6, t2);
        thudG.gain.exponentialRampToValueAtTime(0.0001, t2 + 1.0);
        thud.connect(thudG).connect(master);
        thud.start(t2); thud.stop(t2 + 1.1);
      }, 4800); // الخبطة بقت في آخر الـ 5 ثواني
    } catch {
      /* audio unavailable */
    }
  };

  const beginEntry = () => {
    if (armed) return;
    setArmed(true);
    playGateSound();
    setTimeout(() => setOpening(true), 250);
    // ✅ تأخير إخفاء البوابة لـ 5 ثواني عشان تشوف التأثير كامل
    setTimeout(() => { setHidden(true); onEnter(); }, 5000); 
  };

  if (hidden) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-background overflow-hidden flex items-center justify-center ${opening ? "pointer-events-none" : ""}`}>
      
      {/* الشعاع الذهبي القوي (God Rays) */}
      <div className={`absolute inset-0 z-0 flex items-center justify-center pointer-events-none transition-all duration-[5000ms] ease-in-out ${opening ? "opacity-100 scale-125" : "opacity-0 scale-90"}`}>
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-3xl mix-blend-screen" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-80" />
      </div>

      {/* light beam الأصلي بتاعك */}
      <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-primary blur-md opacity-90 torch-flicker transition-opacity duration-[5000ms] ${opening ? "opacity-0" : "opacity-90"}`} />
      
      {/* تأثير الغبار السينمائي */}
      <DustEffect isActive={opening} />

      {/* dust particles الأصلية الخاصة بك */}
      {!opening && Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="absolute w-1 h-1 rounded-full bg-primary/60 float-slow"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*4}s` }} />
      ))}

      {/* doors - تم التعديل لتنزلق يمين ويسار ببطء شديد على مدار 5 ثواني */}
      <div className="absolute inset-0 flex z-10" style={{ perspective: "1500px" }}>
        <div 
          className={`w-1/2 h-full bg-cover bg-right shadow-deep transition-transform duration-[5000ms] ease-in-out ${opening ? "-translate-x-full" : "translate-x-0"}`}
          style={{ backgroundImage: `url(${gateImg})` }} 
        />
        <div 
          className={`w-1/2 h-full bg-cover bg-left shadow-deep transition-transform duration-[5000ms] ease-in-out ${opening ? "translate-x-full" : "translate-x-0"}`}
          style={{ backgroundImage: `url(${gateImg})`, backgroundPositionX: "-100%" }} 
        />
      </div>

      <button onClick={() => { setHidden(true); onEnter(); }}
        className={`absolute bottom-8 right-8 z-20 text-xs font-display tracking-widest text-primary/70 hover:text-primary transition ${opening ? "opacity-0" : "opacity-100"}`}>
        {t("gate.skip")}
      </button>

      <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center gap-4 transition-opacity duration-1000 ${opening ? "opacity-0" : "opacity-100"}`}>
        {!armed ? (
          <button onClick={beginEntry}
            className="group px-8 py-3 border-2 border-primary bg-background/80 backdrop-blur text-primary font-display text-sm tracking-[0.4em] hover:bg-primary hover:text-primary-foreground transition shadow-gold torch-flicker">
            {t("gate.open")}
          </button>
        ) : (
          <p className="font-display text-primary text-sm tracking-[0.4em] torch-flicker">{t("gate.enter")}</p>
        )}
      </div>
    </div>
  );
};
