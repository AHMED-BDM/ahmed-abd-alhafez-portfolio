import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback, useMemo } from "react";

type TempleMode = "night" | "day";
type SoundKind = "hover" | "click" | "open" | "rumble" | "whisper" | "curse" | "glint" | "gust";

type Ctx = {
  enabled: boolean;
  toggle: () => void;
  play: (kind: SoundKind, options?: { pan?: number; volume?: number }) => void;
};

const SoundCtx = createContext<Ctx>({ enabled: false, toggle: () => {}, play: () => {} });
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
  const [enabled, setEnabled] = useState(false);
  const synth = useSynth();
  const enabledAtRef = useRef<number | null>(null);

  const intensityScale = useMemo(() => {
    if (reducedEffects) return 0.45;
    return intensity === "immersive" ? 1 : 0.68;
  }, [intensity, reducedEffects]);

  const getAdaptiveVolume = useCallback(
    (volume = 1) => {
      const sessionMinutes = enabledAtRef.current ? (Date.now() - enabledAtRef.current) / 60000 : 0;
      const fatigueScale = Math.max(0.55, 1 - sessionMinutes * 0.045);
      return volume * intensityScale * fatigueScale;
    },
    [intensityScale],
  );

  useEffect(() => {
    if (!enabled) {
      enabledAtRef.current = null;
      synth.stopAmbient();
      return;
    }

    if (!enabledAtRef.current) enabledAtRef.current = Date.now();
    void synth.ensure().resume?.();
    synth.startAmbient(mode);
    return () => synth.stopAmbient();
  }, [enabled, mode, synth]);

  useEffect(() => {
    if (!enabled) return;

    const interval = window.setInterval(() => {
      const pan = Math.random() * 1.5 - 0.75;
      const softVolume = getAdaptiveVolume(mode === "night" ? 0.35 : 0.28);

      if (mode === "day") {
        if (Math.random() < 0.65) play("gust", { pan, volume: softVolume });
        if (Math.random() < 0.18) play("whisper", { pan: pan * 0.7, volume: getAdaptiveVolume(0.18) });
      } else {
        if (Math.random() < 0.32) play("rumble", { pan, volume: getAdaptiveVolume(0.12) });
        if (Math.random() < 0.4) play("whisper", { pan, volume: getAdaptiveVolume(0.16) });
        if (Math.random() < 0.26) play("glint", { pan, volume: getAdaptiveVolume(0.12) });
      }
    }, reducedEffects ? 22000 : 16000);

    return () => window.clearInterval(interval);
  }, [enabled, getAdaptiveVolume, mode, play, reducedEffects]);

  const play = useCallback((kind: SoundKind, options?: { pan?: number; volume?: number }) => {
    if (!enabled) return;
    const pan = options?.pan ?? 0;
    const volume = getAdaptiveVolume(options?.volume ?? 1);

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
    }
  }, [enabled, getAdaptiveVolume, synth]);

  const toggle = useCallback(() => {
    if (!enabled) void synth.ensure().resume?.();
    setEnabled((value) => !value);
  }, [enabled, synth]);

  return <SoundCtx.Provider value={{ enabled, toggle, play }}>{children}</SoundCtx.Provider>;
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