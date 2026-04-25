import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react"; // استيراد أيقونات الصوت

type TempleMode = "night" | "day";
type SoundKind = "hover" | "click" | "open" | "rumble" | "whisper" | "curse" | "glint" | "gust" | "spell";

type Ctx = {
  initialized: boolean;
  enabled: boolean;
  toggle: () => void;
  enableSound: () => void;
  play: (kind: SoundKind, options?: { pan?: number; volume?: number }) => void;
  masterVolume: number;
  setMasterVolume: (value: number) => void;
};

const SoundCtx = createContext<Ctx>({
  initialized: false,
  enabled: false,
  toggle: () => {},
  enableSound: () => {},
  play: () => {},
  masterVolume: 0.6,
  setMasterVolume: () => {},
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

  const startAmbient = (mode: TempleMode, masterVol: number) => {
    if (ambientRef.current) ambientRef.current.stop();
    const ac = ensure();
    const master = ac.createGain();
    master.gain.value = (mode === "night" ? 0.035 : 0.03) * masterVol;
    master.connect(ac.destination);

    const drone = ac.createOscillator();
    drone.type = mode === "night" ? "sine" : "triangle";
    drone.frequency.value = mode === "night" ? 58 : 92;
    const droneGain = ac.createGain();
    droneGain.gain.value = mode === "night" ? 0.018 : 0.012;
    drone.connect(droneGain).connect(master);

    const buf = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.45;
    const wind = ac.createBufferSource();
    wind.buffer = buf;
    wind.loop = true;
    const windFilter = ac.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.value = mode === "night" ? 460 : 920;
    const windGain = ac.createGain();
    windGain.gain.value = mode === "night" ? 0.02 : 0.026;
    wind.connect(windFilter).connect(windGain).connect(master);

    drone.start();
    wind.start();
    ambientRef.current = { stop: () => { try { drone.stop(); wind.stop(); } catch {} } };
  };

  const stopAmbient = () => { ambientRef.current?.stop(); ambientRef.current = null; };

  return { tone, noise, startAmbient, stopAmbient, ensure };
};

export const SoundProvider = ({ children, mode }: { children: ReactNode; mode: TempleMode }) => {
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.6);
  const synth = useSynth();

  const getAdaptiveVolume = useCallback((volume = 1) => volume * masterVolume, [masterVolume]);

  const initializeAudio = useCallback(async (source: string) => {
    if (typeof window === "undefined") return;
    try {
      const audioContext = synth.ensure();
      await audioContext.resume?.();
      setInitialized(true);
      setEnabled(true);
    } catch (error) { console.error(error); }
  }, [synth]);

  useEffect(() => {
    if (!initialized || !enabled) {
      synth.stopAmbient();
      return;
    }
    synth.startAmbient(mode, masterVolume);
    return () => synth.stopAmbient();
  }, [enabled, initialized, mode, synth, masterVolume]);

  const play = useCallback((kind: SoundKind, options?: { pan?: number; volume?: number }) => {
    if (!initialized || !enabled) return;
    const pan = options?.pan ?? 0;
    const volume = getAdaptiveVolume(options?.volume ?? 1);
    
    switch (kind) {
      case "hover": synth.tone(880, 0.12, "sine", 0.015 * volume, pan); break;
      case "click": synth.tone(660, 0.18, "triangle", 0.04 * volume, pan); break;
      case "open": synth.noise(1.6, 0.07 * volume, 500, pan); break;
      case "spell": synth.tone(72, 1.6, "sawtooth", 0.035 * volume, pan); break;
      // ... باقي الحالات زي ما هي
    }
  }, [enabled, getAdaptiveVolume, initialized, synth]);

  const toggle = useCallback(() => {
    if (!initialized) { initializeAudio("button"); return; }
    setEnabled((v) => !v);
  }, [enabled, initializeAudio, initialized]);

  return (
    <SoundCtx.Provider value={{ initialized, enabled, toggle, enableSound: () => initializeAudio("button"), play, masterVolume, setMasterVolume }}>
      {children}
    </SoundCtx.Provider>
  );
};

export const SoundToggle = () => {
  const { enabled, toggle, masterVolume, setMasterVolume } = useSound();
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div className="fixed top-24 right-6 z-[75] flex flex-col items-center gap-4">
      {/* Volume Slider (يظهر عند الهوفر أو التفاعل) */}
      <div 
        onMouseEnter={() => setShowSlider(true)} 
        onMouseLeave={() => setShowSlider(false)}
        className="flex flex-col items-center gap-2"
      >
        {showSlider && (
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={masterVolume} 
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="h-24 w-1 bg-primary/20 accent-primary appearance-none cursor-pointer rounded-full [writing-mode:bt-lr]"
            style={{ WebkitAppearance: 'slider-vertical' }}
          />
        )}
        
        {/* Toggle Button */}
        <button 
          onClick={toggle}
          onMouseEnter={() => setShowSlider(true)}
          className="w-11 h-11 rounded-full border-2 border-primary/60 bg-card/80 backdrop-blur text-primary hover:shadow-gold transition flex items-center justify-center shadow-lg"
        >
          {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
    </div>
  );
};
