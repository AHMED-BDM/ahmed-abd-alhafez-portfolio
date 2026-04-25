import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

type TempleMode = "night" | "day";
type SoundKind = "hover" | "click" | "open" | "rumble" | "whisper" | "curse" | "glint" | "gust" | "spell";

type Ctx = {
  initialized: boolean;
  enabled: boolean;
  toggle: () => void;
  enableSound: () => void;
  play: (kind: SoundKind, options?: { pan?: number; volume?: number }) => void;
};

const SoundCtx = createContext<Ctx>({
  initialized: false,
  enabled: false,
  toggle: () => {},
  enableSound: () => {},
  play: () => {},
});

export const useSound = () => useContext(SoundCtx);

const useSynth = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);

  const ensure = () => {
    if (!ctxRef.current) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  };

  const withPan = (pan = 0) => {
    const ac = ensure();
    const panner = typeof ac.createStereoPanner === "function" ? ac.createStereoPanner() : null;
    if (panner) panner.pan.value = Math.max(-1, Math.min(1, pan));
    return { ac, panner };
  };

  const tone = (freq: number, dur: number, type: OscillatorType = "sine", vol = 0.04, pan = 0) => {
    const { ac, panner } = withPan(pan);
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), ac.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    if (panner) o.connect(g).connect(panner).connect(ac.destination);
    else o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + dur + 0.05);
  };

  const noise = (dur: number, vol = 0.05, lp = 800, pan = 0) => {
    const { ac, panner } = withPan(pan);
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = lp;
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    if (panner) src.connect(f).connect(g).connect(panner).connect(ac.destination);
    else src.connect(f).connect(g).connect(ac.destination);
    src.start();
  };

  const startAmbient = (mode: TempleMode) => {
    if (ambientRef.current) ambientRef.current.stop();
    const ac = ensure();
    const master = ac.createGain();
    master.gain.value = mode === "night" ? 0.035 : 0.03;
    master.connect(ac.destination);

    const drone = ac.createOscillator();
    drone.type = mode === "night" ? "sine" : "triangle";
    drone.frequency.value = mode === "night" ? 58 : 92;
    const droneGain = ac.createGain();
    droneGain.gain.value = mode === "night" ? 0.018 : 0.012;
    drone.connect(droneGain).connect(master);
    drone.start();

    ambientRef.current = { stop: () => { try { drone.stop(); } catch {} } };
  };

  const stopAmbient = () => { ambientRef.current?.stop(); ambientRef.current = null; };

  return { tone, noise, startAmbient, stopAmbient, ensure };
};

// بنستقبل كل الخصائص القديمة (حتى لو مش هنستخدمها) عشان الموقع ميضربش
export const SoundProvider = ({ children, mode, intensity, reducedEffects }: any) => {
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const synth = useSynth();

  const initializeAudio = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const audioContext = synth.ensure();
      await audioContext.resume?.();
      setInitialized(true);
      setEnabled(true);
    } catch (error) { console.error(error); }
  }, [synth]);

  // التحكم في تشغيل وإيقاف الصوت بالكامل
  useEffect(() => {
    if (!initialized || !enabled) {
      synth.stopAmbient();
      // قفل كل الأصوات الخارجية (زي الأصوات اللي في ملف audio.js)
      window.document.querySelectorAll("audio").forEach(a => a.muted = true);
      return;
    }
    
    // تشغيل الأصوات مرة تانية
    window.document.querySelectorAll("audio").forEach(a => a.muted = false);
    synth.startAmbient(mode);
    return () => synth.stopAmbient();
  }, [enabled, initialized, mode, synth]);

  const play = useCallback((kind: SoundKind, options?: { pan?: number; volume?: number }) => {
    if (!initialized || !enabled) return;
    const volume = options?.volume ?? 1;
    const pan = options?.pan ?? 0;
    
    switch (kind) {
      case "hover": synth.tone(880, 0.12, "sine", 0.015 * volume, pan); break;
      case "click": synth.tone(660, 0.18, "triangle", 0.04 * volume, pan); break;
      case "open": synth.noise(1.6, 0.07 * volume, 500, pan); break;
      case "rumble": synth.noise(2, 0.08 * volume, 180, pan); break;
      case "whisper": synth.noise(2.4, 0.03 * volume, 1400, pan); break;
      case "curse": synth.tone(110, 1.2, "sawtooth", 0.05 * volume, pan); break;
      case "glint": synth.tone(740, 0.18, "triangle", 0.016 * volume, pan); break;
      case "gust": synth.noise(2.2, 0.024 * volume, 900, pan); break;
      case "spell": synth.tone(72, 1.6, "sawtooth", 0.035 * volume, pan); break;
    }
  }, [enabled, initialized, synth]);

  const toggle = useCallback(() => {
    if (!initialized) { initializeAudio(); return; }
    setEnabled((v) => !v);
  }, [enabled, initializeAudio, initialized]);

  return (
    <SoundCtx.Provider value={{ initialized, enabled, toggle, enableSound: initializeAudio, play }}>
      {children}
    </SoundCtx.Provider>
  );
};

// الزرار الوحيد اللي هيظهر في الموقع (ميوت / تشغيل)
export const SoundToggle = () => {
  const { enabled, toggle } = useSound();
  return (
    <button onClick={toggle}
      className="fixed top-24 right-6 z-[75] w-11 h-11 rounded-full border-2 border-primary/60 bg-card/80 backdrop-blur text-primary hover:shadow-gold transition flex items-center justify-center font-display text-xl shadow-lg">
      {enabled ? "𓂀" : "𓁹"}
    </button>
  );
};
