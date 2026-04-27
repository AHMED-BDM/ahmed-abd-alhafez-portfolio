import { useEffect, useState } from "react";
import gateImg from "@/assets/gate-door.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { DustEffect } from "./DustEffect";

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

      // 1) Deep ominous drone - تم التمديد لـ 6 ثواني
      const drone = ac.createOscillator();
      drone.type = "sawtooth";
      drone.frequency.setValueAtTime(48, now);
      drone.frequency.exponentialRampToValueAtTime(36, now + 5.8); 
      const droneGain = ac.createGain();
      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.exponentialRampToValueAtTime(0.35, now + 1.5);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);
      drone.connect(droneGain).connect(master);
      drone.start(now); drone.stop(now + 6.1);

      // 2) Heavy stone-grinding noise - تم التمديد لـ 6 ثواني
      const buf = ac.createBuffer(1, ac.sampleRate * 6.0, ac.sampleRate);
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
      lp.frequency.linearRampToValueAtTime(800, now + 4.0);
      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.55, now + 1.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);
      noise.connect(lp).connect(noiseGain).connect(master);
      noise.start(now); noise.stop(now + 6.0);

      // 3) Distant cursed whisper-chord
      [110, 138.6, 164.8].forEach((f, i) => {
        const o = ac.createOscillator();
        o.type = "sine";
        o.frequency.value = f;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.06, now + 1 + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
        o.connect(g).connect(master);
        o.start(now); o.stop(now + 5.6);
      });

      // 4) Final thud / boom - الخبطة النهائية لحظة اكتمال الفتح
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
      }, 5800); // تنطلق في الثانية الـ 5.8
    } catch {
      /* audio unavailable */
    }
  };

  const beginEntry = () => {
    if (armed) return;
    setArmed(true);
    playGateSound();
    setTimeout(() => setOpening(true), 250);
    // الانتظار 6.5 ثواني لضمان انتهاء الأنيميشن بالكامل قبل الدخول للموقع
    setTimeout(() => { setHidden(true); onEnter(); }, 6500); 
  };

  if (hidden) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-background overflow-hidden flex items-center justify-center ${opening ? "pointer-events-none" : ""}`}>
      
      {/* الشعاع الذهبي القوي (God Rays) */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{
          transition: "all 6s ease-in-out",
          opacity: opening ? 1 : 0,
          transform: opening ? "scale(1.25)" : "scale(0.9)"
        }}
      >
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent blur-3xl mix-blend-screen" />
        <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-80" />
      </div>

      {/* light beam الأصلي */}
      <div 
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-primary blur-md torch-flicker" 
        style={{
          transition: "opacity 6s ease-in-out",
          opacity: opening ? 0 : 0.9
        }}
      />
      
      {/* تأثير الغبار السينمائي */}
      <DustEffect isActive={opening} />

      {!opening && Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="absolute w-1 h-1 rounded-full bg-primary/60 float-slow"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animationDelay: `${Math.random()*4}s` }} />
      ))}

      {/* الأبواب: تم ضبط الـ transition كـ Inline style لضمان النعومة وعدم تخطي المتصفح للأنيميشن */}
      <div className="absolute inset-0 flex z-10" style={{ perspective: "2000px" }}>
        
        {/* الدرفة اليسرى (تفتح للداخل ناحية اليسار 105 درجة) */}
        <div 
          className="w-1/2 h-full bg-cover bg-right shadow-deep"
          style={{ 
            backgroundImage: `url(${gateImg})`, 
            transformOrigin: "left center",
            transition: "transform 6s cubic-bezier(0.4, 0.0, 0.2, 1)", // حركة ثقيلة وواقعية
            transform: opening ? "rotateY(-105deg)" : "rotateY(0deg)"
          }} 
        />

        {/* الدرفة اليمنى (تفتح للداخل ناحية اليمين 105 درجة) */}
        <div 
          className="w-1/2 h-full bg-cover bg-left shadow-deep"
          style={{ 
            backgroundImage: `url(${gateImg})`, 
            backgroundPositionX: "-100%",
            transformOrigin: "right center",
            transition: "transform 6s cubic-bezier(0.4, 0.0, 0.2, 1)",
            transform: opening ? "rotateY(105deg)" : "rotateY(0deg)"
          }} 
        />
      </div>

      <button onClick={() => { setHidden(true); onEnter(); }}
        className="absolute bottom-8 right-8 z-20 text-xs font-display tracking-widest text-primary/70 hover:text-primary transition"
        style={{
          transition: "opacity 1s ease-in-out",
          opacity: opening ? 0 : 1
        }}>
        {t("gate.skip")}
      </button>

      <div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center gap-4"
        style={{
          transition: "opacity 1s ease-in-out",
          opacity: opening ? 0 : 1
        }}
      >
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
