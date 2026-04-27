import { useEffect, useState } from "react";
import gateImg from "@/assets/gate-door.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { DustEffect } from "./DustEffect";

// الرموز الفرعونية
const GLYPHS = ["𓂀", "𓋹", "𓆣", "𓊪"];

export const EntryGate = ({ onEnter }: { onEnter: () => void }) => {
  const { t } = useLang();
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [armed, setArmed] = useState(false);
  const [dials, setDials] = useState([0, 1, 2]); // بداية ملخبطة

  // 1. صوت نقرة حجرية بسيطة عند الضغط على الرموز
  const playClickSound = () => {
    try {
      const w = window as any;
      const AC = w.AudioContext || w.webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const now = ac.currentTime;
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      
      osc.connect(gain).connect(ac.destination);
      osc.start();
      osc.stop(now + 0.1);
    } catch (e) {}
  };

  // 2. صوت فتح البوابة الضخم (يستدعى فقط عند بدء الفتح)
  const playGateSound = () => {
    try {
      const w = window as any;
      const AC = w.AudioContext || w.webkitAudioContext;
      if (!AC) return;
      const ac = new AC();
      const now = ac.currentTime;
      const master = ac.createGain();
      master.gain.value = 0.7;
      master.connect(ac.destination);

      // Deep drone
      const drone = ac.createOscillator();
      drone.type = "sawtooth";
      drone.frequency.setValueAtTime(48, now);
      drone.frequency.exponentialRampToValueAtTime(36, now + 5.8);
      const dg = ac.createGain();
      dg.gain.setValueAtTime(0.0001, now);
      dg.gain.exponentialRampToValueAtTime(0.3, now + 1.5);
      dg.gain.exponentialRampToValueAtTime(0.0001, now + 6);
      drone.connect(dg).connect(master);
      drone.start(now); drone.stop(now + 6.1);

      // Stone grinding noise
      const buf = ac.createBuffer(1, ac.sampleRate * 6, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        const t = i / d.length;
        d[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(t * 40)) * (1 - t);
      }
      const noise = ac.createBufferSource();
      noise.buffer = buf;
      const lp = ac.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(200, now);
      lp.frequency.linearRampToValueAtTime(600, now + 4);
      const ng = ac.createGain();
      ng.gain.setValueAtTime(0.0001, now);
      ng.gain.exponentialRampToValueAtTime(0.4, now + 1);
      ng.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);
      noise.connect(lp).connect(ng).connect(master);
      noise.start(now);

      // Final Thud
      setTimeout(() => {
        const t2 = ac.currentTime;
        const thud = ac.createOscillator();
        thud.frequency.setValueAtTime(80, t2);
        thud.frequency.exponentialRampToValueAtTime(20, t2 + 0.8);
        const tg = ac.createGain();
        tg.gain.setValueAtTime(0.5, t2);
        tg.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.8);
        thud.connect(tg).connect(master);
        thud.start(t2); thud.stop(t2 + 0.9);
      }, 5800);
    } catch (e) {}
  };

  // دالة بدء الفتح الفعلي
  const handleOpenSequence = () => {
    setOpening(true);
    playGateSound(); // الصوت يشتغل هنا فقط مع بداية حركة الباب
    setTimeout(() => {
      setHidden(true);
      onEnter();
    }, 6500);
  };

  // مراقبة حل اللغز
  useEffect(() => {
    const isSolved = dials.every(v => v === dials[0]);
    if (isSolved && !armed) {
      setArmed(true);
      // ننتظر ثانية واحدة بعد الحل (وميض الرموز) ثم نفتح الباب
      setTimeout(handleOpenSequence, 1000);
    }
  }, [dials]);

  const handleDialClick = (idx: number) => {
    if (armed) return;
    playClickSound(); // صوت نقرة بسيطة فقط
    const newDials = [...dials];
    newDials[idx] = (newDials[idx] + 1) % GLYPHS.length;
    setDials(newDials);
  };

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background overflow-hidden flex items-center justify-center">
      
      {/* تأثير الضوء الذهبي الخلفي */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{
          transition: "opacity 6s ease-in-out",
          opacity: opening ? 1 : 0
        }}
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.3)_0%,_transparent_70%)]" />
      </div>

      <DustEffect isActive={opening} />

      {/* الأبواب الـ 3D */}
      <div className="absolute inset-0 flex z-10" style={{ perspective: "2000px" }}>
        <div 
          className="w-1/2 h-full bg-cover bg-right border-r border-primary/20"
          style={{ 
            backgroundImage: `url(${gateImg})`, 
            transformOrigin: "left center",
            transition: "transform 6s cubic-bezier(0.4, 0, 0.2, 1)", 
            transform: opening ? "rotateY(-105deg)" : "rotateY(0deg)"
          }} 
        />
        <div 
          className="w-1/2 h-full bg-cover bg-left border-l border-primary/20"
          style={{ 
            backgroundImage: `url(${gateImg})`, 
            backgroundPositionX: "-100%",
            transformOrigin: "right center",
            transition: "transform 6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: opening ? "rotateY(105deg)" : "rotateY(0deg)"
          }} 
        />
      </div>

      {/* واجهة اللغز */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-8 transition-all duration-1000"
        style={{ opacity: opening ? 0 : 1, transform: `translate(-50%, ${opening ? '50px' : '0'})` }}
      >
        <div className="text-center">
          <p className="font-display text-primary/60 text-xs tracking-[0.5em] mb-4 uppercase">
            {armed ? "تم فك الختم" : "طابق الرموز المقدسة"}
          </p>
          
          <div className="flex gap-4 p-6 bg-black/40 backdrop-blur-md border border-primary/30 rounded-lg shadow-2xl">
            {dials.map((val, i) => (
              <button
                key={i}
                onClick={() => handleDialClick(i)}
                disabled={armed}
                className={`w-16 h-20 flex items-center justify-center bg-stone-900/80 border-2 transition-all duration-500
                  ${armed ? "border-primary shadow-[0_0_20px_var(--primary)] animate-pulse" : "border-primary/40 hover:border-primary/80"}`}
              >
                <span className={`text-4xl select-none transition-colors duration-500 ${armed ? "text-primary" : "text-primary/70"}`}>
                  {GLYPHS[val]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => { setHidden(true); onEnter(); }}
          className="text-[10px] font-display tracking-[0.3em] text-primary/40 hover:text-primary transition-colors uppercase"
        >
          {t("gate.skip")}
        </button>
      </div>

      {/* شعاع النور عند الفتح */}
      {opening && (
        <div className="absolute inset-0 z-0 bg-white/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
