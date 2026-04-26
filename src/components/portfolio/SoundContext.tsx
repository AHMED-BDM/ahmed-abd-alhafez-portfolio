import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback, useMemo } from "react";

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
      const AC = (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).AudioContext
        || (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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

    ambientRef.current = {
      stop: () => {
        try {
          drone.stop();
          wind.stop();
        } catch {}
      },
    };
  };

  const stopAmbient = () => {
    try {
      ambientRef.current?.stop();
    } catch {}
    ambientRef.current = null;
  };

  return { tone, noise, startAmbient, stopAmbient, ensure };
};

export const SoundProvider = ({
  children,
  mode,
  intensity,
  reducedEffects,
}: {
  children: ReactNode;
  mode: TempleMode;
  intensity: "subtle" | "immersive";
  reducedEffects: boolean;
}) => {
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.6);
  const synth = useSynth();
  const enabledAtRef = useRef<number | null>(null);
  const initSourceRef = useRef<string | null>(null);

  const intensityScale = useMemo(() => {
    if (reducedEffects) return 0.45;
    return intensity === "immersive" ? 1 : 0.68;
  }, [intensity, reducedEffects]);

  const getAdaptiveVolume = useCallback(
    (volume = 1) => {
      const sessionMinutes = enabledAtRef.current ? (Date.now() - enabledAtRef.current) / 60000 : 0;
      const fatigueScale = Math.max(0.55, 1 - sessionMinutes * 0.045);
      return volume * intensityScale * fatigueScale * masterVolume;
    },
    [intensityScale, masterVolume],
  );

  const initializeAudio = useCallback(async (source: "button" | "click" | "scroll" | "mousemove") => {
    if (typeof window === "undefined") return;

    console.log(`[TempleAudio] initialize requested via ${source}`);

    try {
      initSourceRef.current = source;
      const audioContext = synth.ensure();
      console.log("[TempleAudio] audio context created", audioContext.state);
      await audioContext.resume?.();
      console.log("[TempleAudio] play() triggered for ambient layer");
      setInitialized(true);
      setEnabled(true);
    } catch (error) {
      console.error("[TempleAudio] playback failed during initialization", error);
    }
  }, [synth]);

  useEffect(() => {
    if (typeof window === "undefined" || initialized) return;

    const onClick = () => void initializeAudio("click");
    const onScroll = () => void initializeAudio("scroll");
    const onMouseMove = () => void initializeAudio("mousemove");

    window.addEventListener("click", onClick, { once: true, passive: true });
    window.addEventListener("scroll", onScroll, { once: true, passive: true });
    window.addEventListener("mousemove", onMouseMove, { once: true, passive: true });

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [initializeAudio, initialized]);

  useEffect(() => {
    if (!initialized || !enabled) {
      enabledAtRef.current = null;
      synth.stopAmbient();
      return;
    }

    if (!enabledAtRef.current) enabledAtRef.current = Date.now();
    console.log(`[TempleAudio] ambient playback active (${initSourceRef.current ?? "toggle"})`);
    void synth.ensure().resume?.().catch((error) => {
      console.error("[TempleAudio] failed to resume ambient context", error);
    });
    synth.startAmbient(mode);
    return () => synth.stopAmbient();
  }, [enabled, initialized, mode, synth]);

  useEffect(() => {
    if (!initialized || !enabled) return;

    const interval = window.setInterval(() => {
      const pan = Math.random() * 1.5 - 0.75;
      const softVolume = getAdaptiveVolume(mode === "night" ? 0.35 : 0.28);

      if (mode === "day") {
        if (Math.random() < 0.65) synth.noise(2.2, softVolume * 0.024, 900, pan);
        if (Math.random() < 0.18) synth.noise(2.4, getAdaptiveVolume(0.18) * 0.03, 1400, pan * 0.7);
      } else {
        if (Math.random() < 0.32) synth.noise(2, getAdaptiveVolume(0.12) * 0.08, 180, pan);
        if (Math.random() < 0.4) synth.noise(2.4, getAdaptiveVolume(0.16) * 0.03, 1400, pan);
        if (Math.random() < 0.26) {
          synth.tone(740, 0.18, "triangle", getAdaptiveVolume(0.12) * 0.016, pan);
          setTimeout(() => synth.tone(1110, 0.12, "sine", getAdaptiveVolume(0.12) * 0.011, pan), 40);
        }
      }
    }, reducedEffects ? 22000 : 16000);

    return () => window.clearInterval(interval);
  }, [enabled, getAdaptiveVolume, initialized, mode, reducedEffects, synth]);

  const play = useCallback((kind: SoundKind, options?: { pan?: number; volume?: number }) => {
    if (!initialized || !enabled) return;
    const pan = options?.pan ?? 0;
    const volume = getAdaptiveVolume(options?.volume ?? 1);

    console.log(`[TempleAudio] play() triggered for ${kind}`, { pan, volume });

    switch (kind) {
      case "hover":
        synth.tone(880, 0.12, "sine", 0.015 * volume, pan);
        break;
      case "click":
        synth.tone(660, 0.18, "triangle", 0.04 * volume, pan);
        setTimeout(() => synth.tone(990, 0.15, "sine", 0.03 * volume, pan), 60);
        break;
      case "open":
        synth.noise(1.6, 0.07 * volume, 500, pan);
        setTimeout(() => synth.tone(196, 0.8, "sawtooth", 0.035 * volume, pan), 200);
        setTimeout(() => synth.tone(392, 0.5, "triangle", 0.02 * volume, pan), 320);
        break;
      case "rumble":
        synth.noise(2, 0.08 * volume, 180, pan);
        break;
      case "whisper":
        synth.noise(2.4, 0.03 * volume, 1400, pan);
        break;
      case "curse":
        synth.tone(110, 1.2, "sawtooth", 0.05 * volume, pan);
        synth.noise(1.2, 0.045 * volume, 400, pan);
        break;
      case "glint":
        synth.tone(740, 0.18, "triangle", 0.016 * volume, pan);
        setTimeout(() => synth.tone(1110, 0.12, "sine", 0.011 * volume, pan), 40);
        break;
      case "gust":
        synth.noise(2.2, 0.024 * volume, 900, pan);
        break;
      case "spell": {
        // Eerie incantation: layered detuned voices muttering an unintelligible chant
        const ac = synth.ensure();
        const base = ac.currentTime;
        const freqs = [138.6, 174.6, 207.6, 261.6];
        const syllables = 7;
        for (let s = 0; s < syllables; s++) {
          const t0 = s * 0.18;
          const f = freqs[s % freqs.length] * (1 + (Math.random() - 0.5) * 0.04);
          [0, -7, 12].forEach((semi, idx) => {
            const o = ac.createOscillator();
            o.type = idx === 0 ? "sawtooth" : "triangle";
            o.frequency.setValueAtTime(f * Math.pow(2, semi / 12), base + t0);
            o.frequency.linearRampToValueAtTime(
              f * Math.pow(2, semi / 12) * 0.92,
              base + t0 + 0.22,
            );
            const g = ac.createGain();
            g.gain.setValueAtTime(0.0001, base + t0);
            g.gain.exponentialRampToValueAtTime(0.05 * volume * (idx === 0 ? 1 : 0.5), base + t0 + 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, base + t0 + 0.26);
            const lp = ac.createBiquadFilter();
            lp.type = "bandpass";
            lp.frequency.value = 700 + Math.random() * 600;
            lp.Q.value = 6;
            const p = typeof ac.createStereoPanner === "function" ? ac.createStereoPanner() : null;
            if (p) p.pan.value = pan + (Math.random() - 0.5) * 0.6;
            if (p) o.connect(lp).connect(g).connect(p).connect(ac.destination);
            else o.connect(lp).connect(g).connect(ac.destination);
            o.start(base + t0);
            o.stop(base + t0 + 0.3);
          });
        }
        // breathy whisper bed underneath
        synth.noise(syllables * 0.18 + 0.4, 0.02 * volume, 1800, pan);
        // low ominous tail
        synth.tone(72, 1.6, "sawtooth", 0.035 * volume, pan);
        break;
      }
    }
  }, [enabled, getAdaptiveVolume, initialized, synth]);

  const toggle = useCallback(() => {
    if (!initialized) {
      void initializeAudio("button");
      return;
    }

    if (!enabled) {
      console.log("[TempleAudio] play() triggered from toggle");
      void synth.ensure().resume?.().catch((error) => {
        console.error("[TempleAudio] failed to resume from toggle", error);
      });
    }

    setEnabled((value) => !value);
  }, [enabled, initializeAudio, initialized, synth]);

  const enableSound = useCallback(() => {
    void initializeAudio("button");
  }, [initializeAudio]);

  return (
    <SoundCtx.Provider value={{ initialized, enabled, toggle, enableSound, play, masterVolume, setMasterVolume }}>
      {children}
    </SoundCtx.Provider>
  );
};

export const SoundToggle = () => {
  const { enabled, toggle } = useSound();
  return (
    <button onClick={toggle}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      className="fixed top-24 right-6 z-[75] w-11 h-11 rounded-full border-2 border-primary/60 bg-card/80 backdrop-blur text-primary hover:shadow-gold transition flex items-center justify-center font-display">
      {enabled ? "𓂀" : "𓁹"}
      <span className="sr-only">{enabled ? "Sound on" : "Sound off"}</span>
    </button>
  );
};
